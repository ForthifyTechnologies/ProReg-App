import { create } from "zustand";

type TImaluumSession = {
	username: string;
	password: string;
};

type TImaluumSessionStore = {
	imaluumSession: TImaluumSession;
	setImaluumSession: (imaluumSssion: TImaluumSession) => void;
};

export const useImaluumSessionStore = create<TImaluumSessionStore>((set) => ({
	imaluumSession: { username: "", password: "" },
	setImaluumSession: (imaluumSession) => set({ imaluumSession }),
}));
