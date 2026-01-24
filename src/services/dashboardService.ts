/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/api/axios";
import { type DashboardData } from "@/types/dashboard";

export const dashboardService = {
  async getData(): Promise<DashboardData> {
    const { data } = await api.get("/admin/dashboard");
    return data;
  },

  async getStatsByPeriod(period: "day" | "week" | "month" | "year"): Promise<any> {
    const { data } = await api.get("/admin/dashboard/stats-by-period", {
      params: { period },
    });
    return data;
  },
};