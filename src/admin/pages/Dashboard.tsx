/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  FileText,
  GraduationCap,
  Building2,
  MapPin,
  Clock,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { dashboardService } from "@/services/dashboardService";
import type { DashboardData } from "@/types/dashboard";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const dashboardData = await dashboardService.getData();
        setData(dashboardData);
      } catch (error) {
        toast.error("Erreur lors du chargement du dashboard");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMM yyyy", { locale: fr });
    } catch {
      return dateString;
    }
  };

  const getStatutBadge = (statut: string) => {
    const variants: Record<string, any> = {
      EN_ATTENTE: { variant: "secondary", icon: Clock },
      APPROUVEE: { variant: "default", icon: CheckCircle },
      REJETEE: { variant: "destructive", icon: XCircle },
      VALIDEE: { variant: "default", icon: CheckCircle },
    };

    const config = variants[statut] || { variant: "secondary", icon: AlertCircle };
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="text-xs">
        <Icon className="h-3 w-3 mr-1" />
        {statut.replace("_", " ")}
      </Badge>
    );
  };

  // Couleurs pour les graphiques
  const COLORS = {
    EN_ATTENTE: "#94a3b8",
    APPROUVEE: "#3b82f6",
    REJETEE: "#ef4444",
    VALIDEE: "#10b981",
  };

  const PIE_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return <div className="p-6">Erreur lors du chargement des données</div>;
  }

  const stats = data.stats;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Tableau de bord</h1>
        <p className="text-muted-foreground">
          Vue d'ensemble de la plateforme de gestion des concours
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Candidatures */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Candidatures
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_candidatures}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.candidatures_ce_mois} ce mois
            </p>
          </CardContent>
        </Card>

        {/* En Attente */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">En Attente</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.candidatures_en_attente}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              À traiter
            </p>
          </CardContent>
        </Card>

        {/* Approuvées */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Approuvées</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.candidatures_approuvees}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Taux: {data.taux_reussite.taux_approbation}%
            </p>
          </CardContent>
        </Card>

        {/* Utilisateurs */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_utilisateurs}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.total_candidats} candidats
            </p>
          </CardContent>
        </Card>

        {/* Concours */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Concours</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_concours}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.concours_actifs} actifs
            </p>
          </CardContent>
        </Card>

        {/* Écoles */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Écoles</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_ecoles}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Établissements
            </p>
          </CardContent>
        </Card>

        {/* Centres */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Centres</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_centres}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.centres_depot} dépôt, {stats.centres_examen} examen
            </p>
          </CardContent>
        </Card>

        {/* Aujourd'hui */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Aujourd'hui</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.candidatures_aujourdhui}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Nouvelles candidatures
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Évolution des candidatures */}
        <Card>
          <CardHeader>
            <CardTitle>Évolution des candidatures</CardTitle>
            <CardDescription>12 derniers mois</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.candidatures_par_mois}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mois" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Candidatures"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Répartition par statut */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition par statut</CardTitle>
            <CardDescription>Distribution actuelle</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.candidatures_par_statut}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry: any) => `${entry.label}: ${entry.total}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="total"
                >
                  {data.candidatures_par_statut.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[entry.statut as keyof typeof COLORS] || PIE_COLORS[index]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Écoles */}
        <Card>
          <CardHeader>
            <CardTitle>Top 10 Écoles</CardTitle>
            <CardDescription>Par nombre de candidatures</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.candidatures_par_ecole}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="libelle_ecole" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Concours */}
        <Card>
          <CardHeader>
            <CardTitle>Top 10 Concours</CardTitle>
            <CardDescription>Par nombre de candidatures</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.candidatures_par_concours}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="libelle_concours" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Listes */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Concours actifs */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Concours actifs</CardTitle>
                <CardDescription>Prochaines échéances</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/admin/concours")}
              >
                Voir tout
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.concours_actifs.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Aucun concours actif
                </p>
              ) : (
                data.concours_actifs.map((concours) => (
                  <div
                    key={concours.id}
                    className="flex items-start justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/admin/concours/${concours.id}`)}
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        {concours.libelle_concours}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {concours.ecole}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Date limite: {formatDate(concours.date_limite)}
                      </p>
                    </div>
                    <Badge
                      variant={
                        concours.jours_restants <= 7 ? "destructive" : "secondary"
                      }
                    >
                      {concours.jours_restants} jrs restants
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Candidatures récentes */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Candidatures récentes</CardTitle>
                <CardDescription>10 dernières</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/admin/candidatures")}
              >
                Voir tout
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.candidatures_recentes.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Aucune candidature récente
                </p>
              ) : (
                data.candidatures_recentes.map((candidature) => (
                  <div
                    key={candidature.id}
                    className="flex items-start justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/admin/candidatures/${candidature.id}`)}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {candidature.candidat_nom} {candidature.candidat_prenom}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {candidature.concours}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(candidature.date_candidature)}
                      </p>
                    </div>
                    <div className="ml-2">
                      {getStatutBadge(candidature.statut)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;