import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash } from "lucide-react";
import { toast } from "sonner";
import { sessionService, type Session } from "@/services/sessionService";
import { DeleteSessionDialog } from "@/components/admin/sessions/DeleteSessionDialog";
import { SessionModal } from "@/components/admin/sessions/SessionModal";
import { Badge } from "@/components/ui/badge";

const Sessions = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Sessions</h1>
        <Button
          onClick={() => {
            setSelectedSession(null);
            setOpenModal(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle session
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Libellé</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>État</TableHead>
              <TableHead className="w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {sessions.map((session) => {
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

                  {/* <TableCell>
                    {etat && (
                      <Button
                        size="sm"
                        variant={
                          etat.libelle_etat === "OUVERTE"
                            ? "default"
                            : "secondary"
                        }
                        onClick={async () => {
                          try {
                            await sessionService.changeEtat(
                              session.id,
                              etat.libelle_etat === "OUVERTE"
                                ? ETAT_FERMEE_ID
                                : ETAT_OUVERTE_ID,
                            );

                            toast.success("État mis à jour");
                            loadSessions();
                          } catch {
                            toast.error("Erreur lors du changement d’état");
                          }
                        }}
                      >
                        {etat.libelle_etat.toLowerCase()}
                      </Button>
                    )}
                  </TableCell> */}

                  <TableCell className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedSession(session);
                        setOpenModal(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-600"
                      onClick={() => {
                        setSelectedSession(session);
                        setOpenDelete(true);
                      }}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}

            {!loading && sessions.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-muted-foreground"
                >
                  Aucune session trouvée
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
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
