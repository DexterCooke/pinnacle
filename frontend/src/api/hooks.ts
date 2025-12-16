import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./client";

export function useList<T>(key: string, path: string) {
  return useQuery({
    queryKey: [key],
    queryFn: async () => {
      const res = await api.get<T[]>(path);
      return res.data;
    },
  });
}

export function useCreate<TIn extends object, TOut>(key: string, path: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: TIn) => {
      const res = await api.post<TOut>(path, payload);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [key] });
    },
  });
}
