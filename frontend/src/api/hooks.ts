import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "./client";

export function useList<T>(key: string, path: string) {
  return useQuery<T[]>({
    queryKey: [key],
    queryFn: async () => (await api.get(path)).data,
  });
}

export function useCreate<TIn, TOut>(key: string, path: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: TIn) => (await api.post<TOut>(path, payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: [key] }),
  });
}
