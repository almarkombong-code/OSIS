
'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  writeBatch,
  getDocs,
  query,
  where,
  increment,
  runTransaction
} from "firebase/firestore";
import { db } from '@/lib/firebase';
import { Candidate, initialCandidates, Voter, initialVoters, Admin, admins as initialAdmins } from '@/lib/data';

interface AppContextType {
  candidates: Candidate[];
  addCandidate: (candidate: Omit<Candidate, 'id' | 'votes'>) => Promise<void>;
  updateCandidate: (id: string, updatedCandidate: Omit<Candidate, 'id' | 'firebaseId'>) => Promise<void>;
  removeCandidate: (id: string) => Promise<void>;
  removeAllCandidates: () => Promise<void>;
  voters: Voter[];
  addVoter: (voter: Omit<Voter, 'hasVoted' | 'firebaseId'>) => Promise<void>;
  updateVoter: (id: string, updatedVoter: Omit<Voter, 'hasVoted' | 'nis' | 'firebaseId'>) => Promise<void>;
  removeVoter: (id: string) => Promise<void>;
  removeAllVoters: () => Promise<void>;
  currentUser: Voter | null;
  setCurrentUser: (user: Voter | null) => void;
  castVote: (candidateId: string, voterNis: string) => Promise<void>;
  admins: Admin[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [voters, setVoters] = useState<Voter[]>([]);
  const [currentUser, setCurrentUser] = useState<Voter | null>(null);
  const [admins] = useState<Admin[]>(initialAdmins);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let unsubscribeCandidates: () => void;
    let unsubscribeVoters: () => void;

    const initialize = async () => {
      setIsLoading(true);
      try {
        console.log("Initializing data...");

        // 1. Seed initial data if necessary
        const candidatesCollection = collection(db, "candidates");
        const candidateSnapshot = await getDocs(candidatesCollection);
        if (candidateSnapshot.empty) {
            console.log("Seeding initial candidates...");
            const batch = writeBatch(db);
            initialCandidates.forEach(candidate => {
                const docRef = doc(candidatesCollection);
                batch.set(docRef, candidate);
            });
            await batch.commit();
        }

        const votersCollection = collection(db, "voters");
        const voterSnapshot = await getDocs(votersCollection);
        if (voterSnapshot.empty) {
            console.log("Seeding initial voters...");
            const batch = writeBatch(db);
            initialVoters.forEach(voter => {
                 const docRef = doc(votersCollection);
                 batch.set(docRef, { ...voter, hasVoted: false });
            });
            await batch.commit();
        }
        
        console.log("Seeding check complete. Setting up listeners...");

        // 2. Set up realtime listeners
        unsubscribeCandidates = onSnapshot(collection(db, "candidates"), 
            (snapshot) => {
              const candidatesData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as unknown as Candidate));
              setCandidates(candidatesData);
              console.log("Candidates updated:", candidatesData.length);
            }, 
            (error) => {
              console.error("Candidate listener error: ", error);
              setCandidates([]);
            }
          );
    
        unsubscribeVoters = onSnapshot(collection(db, "voters"), 
            (snapshot) => {
              const votersData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as unknown as Voter));
              setVoters(votersData);
              console.log("Voters updated:", votersData.length);
            }, 
            (error) => {
              console.error("Voter listener error: ", error);
              setVoters([]);
            }
          );

      } catch (error) {
        console.error("Failed to initialize data:", error);
      } finally {
        // This block is guaranteed to run, ensuring loading state is always resolved.
        setIsLoading(false);
        console.log("Initialization finished. Loading state is now false.");
      }
    };

    initialize();

    // Cleanup function to unsubscribe listeners when component unmounts
    return () => {
      if (unsubscribeCandidates) unsubscribeCandidates();
      if (unsubscribeVoters) unsubscribeVoters();
    };
  }, []);


  // Candidate Actions
  const addCandidate = async (candidateData: Omit<Candidate, 'id' | 'votes'>) => {
    await addDoc(collection(db, "candidates"), {
      ...candidateData,
      votes: 0
    });
  };

  const updateCandidate = async (id: string, updatedCandidateData: Omit<Candidate, 'id'>) => {
    const candidateDoc = doc(db, "candidates", id);
    await updateDoc(candidateDoc, updatedCandidateData);
  };

  const removeCandidate = async (id: string) => {
    await deleteDoc(doc(db, "candidates", id));
  };

  const removeAllCandidates = async () => {
    const batch = writeBatch(db);
    const snapshot = await getDocs(collection(db, "candidates"));
    snapshot.docs.forEach(doc => batch.delete(doc.ref));
    await batch.commit();
  };

  // Voter Actions
  const addVoter = async (voterData: Omit<Voter, 'id' | 'hasVoted'>) => {
    const q = query(collection(db, "voters"), where("nis", "==", voterData.nis));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      throw new Error(`Pemilih dengan NIS ${voterData.nis} sudah ada.`);
    }
    await addDoc(collection(db, "voters"), {
      ...voterData,
      hasVoted: false
    });
  };

  const updateVoter = async (id: string, updatedVoterData: Omit<Voter, 'id' | 'hasVoted' | 'nis'>) => {
    const voterDoc = doc(db, "voters", id);
    await updateDoc(voterDoc, updatedVoterData);
  };

  const removeVoter = async (id: string) => {
    await deleteDoc(doc(db, "voters", id));
  };

  const removeAllVoters = async () => {
    const batch = writeBatch(db);
    const snapshot = await getDocs(collection(db, "voters"));
    snapshot.docs.forEach(doc => batch.delete(doc.ref));
    await batch.commit();
  }

  // Voting Actions
  const castVote = async (candidateId: string, voterNis: string) => {
    const q = query(collection(db, "voters"), where("nis", "==", voterNis));
    const voterSnapshot = await getDocs(q);

    if (voterSnapshot.empty) {
      throw new Error("Voter not found");
    }

    const voterDocRef = voterSnapshot.docs[0].ref;
    const candidateDocRef = doc(db, "candidates", candidateId);

    await runTransaction(db, async (transaction) => {
      const voterDoc = await transaction.get(voterDocRef);
      if (!voterDoc.exists() || voterDoc.data().hasVoted) {
        throw new Error("Voter has already voted or does not exist.");
      }

      transaction.update(voterDocRef, { hasVoted: true });
      transaction.update(candidateDocRef, { votes: increment(1) });
    });
    
    // Update current user state if they are the one voting
    if(currentUser && currentUser.nis === voterNis){
        setCurrentUser(prev => prev ? { ...prev, hasVoted: true } : null);
    }
  };
  
  if (isLoading) {
      return <div className="flex h-screen w-full items-center justify-center">Loading application data...</div>
  }

  return (
    <AppContext.Provider value={{ 
        candidates, addCandidate, updateCandidate, removeCandidate, removeAllCandidates,
        voters, addVoter, updateVoter, removeVoter, removeAllVoters,
        currentUser, setCurrentUser,
        castVote,
        admins
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
