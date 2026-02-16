import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton"; // Ajoutez cette importation
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Pencil, Trash, MoreVertical } from "lucide-react";
import { toast } from "sonner";
import { sessionService, type Session } from "@/services/sessionService";
import { DeleteSessionDialog } from "@/components/admin/sessions/DeleteSessionDialog";
import { SessionModal } from "@/components/admin/sessions/SessionModal";
import { Badge } from "@/components/ui/badge";

const Sessions = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true); // Changé à true par défaut

  const [openModal, setOpenModal] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  const getCurrentEtat = (session: Session) => {
    if (!session.historiques?.length) return null;

    return session.historiques
      .slice()
      .sort(
        (a, b) =>
          new Date(b.date_etat).getTime() -
          new Date(a.date_etat).getTime(),
      )[0].etat;
  };

  const loadSessions = async () => {
    try {
      setLoading(true);
      const data = await sessionService.getAll();
      setSessions(data);
    } catch {
      toast.error("Erreur lors du chargement des sessions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const handleEdit = (session: Session) => {
    setSelectedSession(session);
    setOpenModal(true);
  };

  const handleDelete = (session: Session) => {
    setSelectedSession(session);
    setOpenDelete(true);
  };

  /* ============================
     SKELETON ROWS
  ============================ */
  const skeletonRows = Array.from({ length: 3 }).map((_, index) => (
    <TableRow key={`skeleton-${index}`}>
      <TableCell>
        <Skeleton className="h-4 w-32" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-48" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-6 w-20 rounded-full" />
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      </TableCell>
    </TableRow>
  ));

  /* ============================
     SKELETON CARDS (MOBILE)
  ============================ */
  const skeletonCards = Array.from({ length: 3 }).map((_, index) => (
    <Card key={`skeleton-card-${index}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </CardContent>
    </Card>
  ));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl font-semibold">Sessions</h1>
        <Button
          onClick={() => {
            setSelectedSession(null);
            setOpenModal(true);
          }}
          className="w-full sm:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle session
        </Button>
      </div>

      {/* Table - Desktop */}
      <div className="hidden md:block rounded-lg border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Libellé</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>État</TableHead>
              <TableHead className="w-30">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              skeletonRows
            ) : sessions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-muted-foreground py-10"
                >
                  Aucune session trouvée
                </TableCell>
              </TableRow>
            ) : (
              sessions.map((session) => {
                const etat = getCurrentEtat(session);

                return (
                  <TableRow key={session.id}>
                    <TableCell className="font-medium">
                      {session.libelle_session}
                    </TableCell>

                    <TableCell className="text-muted-foreground">
                      {session.description_session}
                    </TableCell>

                    <TableCell>
                      {etat && (
                        <Badge
                          variant={
                            etat.libelle_etat === "OUVERTE"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {etat.libelle_etat.toLowerCase()}
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(session)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-600"
                          onClick={() => handleDelete(session)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Cards - Mobile */}
      <div className="md:hidden space-y-4">
        {loading ? (
          skeletonCards
        ) : sessions.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              Aucune session trouvée
            </CardContent>
          </Card>
        ) : (
          sessions.map((session) => {
            const etat = getCurrentEtat(session);

            return (
              <Card key={session.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base">
                        {session.libelle_session}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {session.description_session}
                      </CardDescription>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(session)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(session)}
                          className="text-red-600"
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>

                <CardContent>
                  {etat && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">État:</span>
                      <Badge
                        variant={
                          etat.libelle_etat === "OUVERTE"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {etat.libelle_etat.toLowerCase()}
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      <SessionModal
        open={openModal}
        onOpenChange={setOpenModal}
        session={selectedSession}
        onSuccess={loadSessions}
      />

      {selectedSession && (
        <DeleteSessionDialog
          open={openDelete}
          onOpenChange={setOpenDelete}
          sessionId={selectedSession.id}
          onSuccess={loadSessions}
        />
      )}
    </div>
  );
};

export default Sessions;