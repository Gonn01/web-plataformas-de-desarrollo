import { useMemo } from "react";

export function useActiveExpensesFilter(groups, currency, query) {
    return useMemo(() => {
        const q = query.trim().toLowerCase();

        let filtered = groups;

        if (q) {
            filtered = filtered
                .map((g) => ({
                    ...g,
                    items: g.items.filter((it) =>
                        it.title.toLowerCase().includes(q)
                    ),
                }))
                .filter((g) => g.items.length > 0);
        }

        return filtered
            .map((g) => ({
                ...g,
                items: g.items.filter((it) => it.currency === currency),
            }))
            .filter((g) => g.items.length > 0);
    }, [groups, currency, query]);
}
