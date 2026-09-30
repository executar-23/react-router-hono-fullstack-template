import { useCallback, useEffect, useState } from "react";
import { MODULES, SEED, seedData, uid } from "./data";
import type { HubData, HubRecord, Vocab } from "./types";

const KEY = "rc_hub_v1";

export function useHubStore() {
	const [data, setData] = useState<HubData>(seedData);
	const [vocab, setVocab] = useState<Vocab>(SEED.vocab);
	const [ready, setReady] = useState(false);

	// Hydrate from localStorage after mount (server render uses the seed).
	useEffect(() => {
		try {
			const raw = localStorage.getItem(KEY);
			if (raw) {
				const parsed = JSON.parse(raw) as { data?: HubData; vocab?: Vocab };
				if (parsed.data) setData({ ...seedData(), ...parsed.data });
				if (parsed.vocab) setVocab(parsed.vocab);
			}
		} catch {
			/* storage unavailable or corrupt: keep the seed */
		}
		setReady(true);
	}, []);

	useEffect(() => {
		if (!ready) return;
		try {
			localStorage.setItem(KEY, JSON.stringify({ data, vocab }));
		} catch {
			/* ignore quota / privacy-mode errors */
		}
	}, [data, vocab, ready]);

	const addRecord = useCallback(
		(moduleId: string, fields: Omit<HubRecord, "_id">) => {
			const rec = { _id: uid(), ...fields } as HubRecord;
			setData((p) => ({ ...p, [moduleId]: [...(p[moduleId] ?? []), rec] }));
			return rec._id;
		},
		[],
	);

	const updateRecord = useCallback(
		(moduleId: string, id: string, patch: Partial<HubRecord>) => {
			setData((p) => ({
				...p,
				[moduleId]: (p[moduleId] ?? []).map((r) =>
					r._id === id ? { ...r, ...patch, _id: id } : r,
				),
			}));
		},
		[],
	);

	const deleteRecord = useCallback((moduleId: string, id: string) => {
		setData((p) => ({
			...p,
			[moduleId]: (p[moduleId] ?? []).filter((r) => r._id !== id),
		}));
	}, []);

	const replaceAll = useCallback((next: HubData, nextVocab?: Vocab) => {
		const merged: HubData = {};
		for (const m of MODULES) {
			merged[m.id] = (next[m.id] ?? []).map(
				(r) => ({ ...r, _id: r._id ?? uid() }) as HubRecord,
			);
		}
		setData(merged);
		if (nextVocab) setVocab(nextVocab);
	}, []);

	return {
		data,
		vocab,
		setVocab,
		ready,
		addRecord,
		updateRecord,
		deleteRecord,
		replaceAll,
	};
}

export type HubStore = ReturnType<typeof useHubStore>;
