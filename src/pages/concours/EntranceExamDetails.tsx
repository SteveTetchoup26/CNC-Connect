/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getConcoursById } from "@/store/concours/concoursSlice";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  GraduationCap,
  Clock,
  Building2,
  CreditCard,
  ChevronDown,
  ChevronUp,
  FileText,
} from "lucide-react";
import type { RootState, AppDispatch } from "@/store/store";

const EntranceExamDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { selected, loading, error, isInscrit } = useSelector(
    (state: RootState) => state.concours,
  );

  const [documentsOpen, setDocumentsOpen] = useState(false);

  const formatDate = (dt: Date) => {
    const date = new Date(dt);
    const day = date.getDate();
    const month = date.toLocaleString("fr-FR", { month: "long" });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR").format(amount);
  };

  useEffect(() => {
    if (id && (!selected || selected.id !== parseInt(id))) {
      dispatch(getConcoursById(id));
    }
  }, [id]);

  /* ============================
     SKELETONS
  ============================ */
  const skeletonHeader = (
    <div className="relative mb-8">
      {/* Skeleton pour la bannière */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded-2xl h-[200px] md:h-[300px]"></div>

      {/* Overlay skeleton */}
      <div className="absolute inset-0 bg-black/20 z-10 rounded-2xl"></div>

      {/* Contenu skeleton */}
      <div className="relative z-20 text-white p-4 md:p-10">
        {/* Badge skeleton */}
        <Skeleton className="h-6 w-32 bg-white/50 mb-6 rounded-full" />

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          {/* Texte skeleton */}
          <div className="flex-1 min-w-0 space-y-4">
            <Skeleton className="h-8 w-3/4 bg-white/80 md:h-10" />
            <Skeleton className="h-4 w-1/2 bg-white/70 md:h-6" />
            <Skeleton className="h-4 w-2/3 bg-white/60 md:h-5" />
          </div>

          {/* Logo skeleton */}
          <div className="flex-shrink-0">
            <Skeleton className="w-16 h-16 bg-white/60 rounded-lg md:w-24 md:h-24" />
          </div>
        </div>
      </div>
    </div>
  );

  const skeletonInfoCards = (
    <Card className="mb-8 border-2">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-start gap-3">
              <Skeleton className="w-5 h-5 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-6 w-24" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const skeletonFiliereSection = (
    <section className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Skeleton className="w-6 h-6 rounded-full" />
        <Skeleton className="h-6 w-48" />
      </div>
      <Card>
        <CardContent className="p-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </CardContent>
      </Card>
    </section>
  );

  const skeletonDocumentsSection = (
    <section className="mb-8">
      <div className="flex items-center justify-between bg-red-600 text-white px-6 py-3 font-semibold text-lg cursor-pointer">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-40 bg-white/80" />
        </div>
        <Skeleton className="h-4 w-4 bg-white/80" />
      </div>
      <Card className="rounded-t-none border-t-0">
        <CardContent className="p-6 space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6 ml-4" />
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );

  const skeletonPaymentSection = (
    <section className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Skeleton className="w-6 h-6 rounded-full" />
        <Skeleton className="h-6 w-56" />
      </div>
      <Card className="border-2 border-primary/20 bg-primary/5">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className={`h-6 ${index === 2 ? "w-40" : "w-32"}`} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {skeletonHeader}
        <Skeleton className="h-4 w-full mb-8" />
        <Skeleton className="h-4 w-2/3 mb-8" />
        {skeletonInfoCards}
        {skeletonFiliereSection}
        {skeletonDocumentsSection}
        {skeletonPaymentSection}
        <section className="pt-6 pb-4">
          <Skeleton className="h-4 w-64 mb-2" />
          <Skeleton className="h-4 w-48" />
        </section>
        <section className="text-center pt-6 pb-4">
          <Skeleton className="h-12 w-48 mx-auto rounded-lg" />
        </section>
      </main>
    );
  }

  if (error) {
    return <div className="py-20 text-center text-destructive">{error}</div>;
  }

  if (!selected) return null;

  const session = selected.sessions?.[0];
  const ecole = selected.concours_filieres?.[0]?.filiere?.departement?.ecole;
  const specification = selected.specification;
  const frais = selected.frais_concours;

  return (
    <main className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header avec logo - Responsive amélioré */}
      <div className="relative mb-8 min-h-50 md:min-h-75 flex items-center rounded-2xl overflow-hidden">
        {/* Section de la bannière */}
        {ecole?.banniere_url ? (
          <div className="absolute inset-0 z-0">
            <img
              src={
                ecole.banniere_url.startsWith("http")
                  ? ecole.banniere_url
                  : `${import.meta.env.VITE_API_URL?.replace("/api/v1", "") || "http://localhost:8000"}/storage/${ecole.banniere_url}`
              }
              alt={`Bannière ${ecole.libelle_ecole}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            {/* Overlay sombre pour améliorer la lisibilité */}
            <div className="absolute inset-0 bg-black/35 z-10"></div>
          </div>
        ) : (
          <div className="absolute inset-0 z-0 bg-linear-to-r from-primary/20 to-secondary/20"></div>
        )}

        {/* Contenu principal */}
        <div className="relative z-20 text-white w-full p-4 md:p-10">
          <section className="w-full">
            <Badge className="bg-white/70 text-secondary border border-primary/20 mb-4 md:mb-6 text-xs md:text-sm">
              Concours officiel
            </Badge>

            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 md:gap-6">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl md:text-4xl font-bold mb-2 md:mb-3 leading-tight">
                  {selected.libelle_concours}
                </h1>
                <p className="text-sm md:text-lg font-bold leading-relaxed">
                  {ecole?.libelle_ecole && (
                    <>
                      <span className="block md:inline">
                        {ecole.libelle_ecole}
                      </span>
                      <span className="hidden md:inline"> — </span>
                      <span className="block md:inline">
                        {session?.libelle_session}
                      </span>
                    </>
                  )}
                  {!ecole?.libelle_ecole && session?.libelle_session}
                </p>
              </div>

              {ecole?.logo_url && (
                <div className="shrink-0 mt-4 md:mt-0 self-center md:self-start">
                  <img
                    src={
                      ecole.logo_url.startsWith("http")
                        ? ecole.logo_url
                        : `${import.meta.env.VITE_API_URL?.replace("/api/v1", "") || "http://localhost:8000"}/storage/${ecole.logo_url}`
                    }
                    alt={`Logo ${ecole.libelle_ecole}`}
                    className="w-16 h-16 md:w-24 md:h-24 object-contain bg-white/10 p-2 rounded-lg"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Description du concours */}
      <section className="mb-8">
        <div className="mt-4">
          <p className="text-sm leading-relaxed">
            {ecole?.libelle_ecole && (
              <>
                <strong>{ecole.libelle_ecole}</strong>{" "}
              </>
            )}
            lance un concours d'entrée pour la{" "}
            {session?.libelle_session || "session en cours"}
            {selected.concours_filieres &&
              selected.concours_filieres.length > 0 && (
                <>
                  {" "}
                  dans{" "}
                  {selected.concours_filieres.length > 1
                    ? "les filières"
                    : "la filière"}{" "}
                  {selected.concours_filieres.map((cf: any, idx: number) => {
                    const niveaux = cf.filiere?.niveaux || [];
                    const niveauxStr =
                      niveaux.length > 0
                        ? ` (${niveaux.map((n: any) => n.libelle_niveau || n.niveau).join(", ")})`
                        : "";
                    return (
                      <span key={cf.id}>
                        <strong>{cf.filiere.libelle_filiere}</strong>
                        {niveauxStr}
                        {idx === selected.concours_filieres.length - 2
                          ? " et "
                          : idx < selected.concours_filieres.length - 1
                            ? ", "
                            : ""}
                      </span>
                    );
                  })}
                  .
                </>
              )}
            {!selected.concours_filieres?.length && "."}
          </p>
        </div>
      </section>

      {/* Infos clés */}
      <Card className="mb-8 border-2">
        <CardContent className="p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Date limite d'inscription
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {formatDate(selected.date_limite)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Date de l'examen
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {formatDate(selected.date_examen)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CreditCard className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Frais d'inscription
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(frais?.montant_frais || 0)} FCFA
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filières disponibles */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <GraduationCap className="w-6 h-6 text-primary" />
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-400">
            Filières disponibles
          </h2>
        </div>

        <Card>
          <CardContent className="p-4 md:p-6">
            <p className="text-gray-700 leading-relaxed dark:text-white!">
              {selected.concours_filieres?.map((cf: any, index: number) => (
                <span key={cf.id}>
                  <strong>{cf.filiere.libelle_filiere}</strong> (
                  {cf.nbre_places} places) —{" "}
                  {cf.filiere.departement.libelle_departement}
                  {index < selected.concours_filieres.length - 1 ? " • " : ""}
                </span>
              ))}
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Documents nécessaires - Dépliable */}
      {specification && (
        <section className="mb-8">
          <div
            className="flex items-center justify-between bg-red-600 text-white px-4 md:px-6 py-3 font-semibold text-lg cursor-pointer hover:bg-red-700 transition-colors"
            onClick={() => setDocumentsOpen(!documentsOpen)}
          >
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              <span>Documents Nécessaires / Necessary Documents</span>
            </div>
            {documentsOpen ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </div>

          {documentsOpen && (
            <Card className="rounded-t-none border-t-0">
              <CardContent className="p-4 md:p-6 space-y-3">
                {specification.acte_naissance && (
                  <p className="text-gray-700 leading-relaxed dark:text-white!">
                    • Une photocopie certifiée d'acte de naissance datant de
                    moins de trois (03) mois.
                    <em className="text-gray-600 dark:text-gray-400 ">
                      {" "}
                      / A certified true photocopy of the birth certificate
                      issued within the last three (03) months.
                    </em>
                  </p>
                )}

                {specification.diplomes && (
                  <p className="text-gray-700 leading-relaxed dark:text-white!">
                    • Une photocopie certifiée conforme du diplôme/attestation
                    requis.
                    <em className="text-gray-600 dark:text-gray-400">
                      {" "}
                      / A certified true copy of the required diploma.
                    </em>
                  </p>
                )}

                {specification.releve_notes && (
                  <p className="text-gray-700 leading-relaxed dark:text-white!">
                    • Un relevé de notes officiel.
                    <em className="text-gray-600 dark:text-gray-400">
                      {" "}
                      / An official transcript of records.
                    </em>
                  </p>
                )}

                {specification.certificat_nationalite && (
                  <p className="text-gray-700 leading-relaxed dark:text-white!">
                    • Un certificat de nationalité.
                    <em className="text-gray-600 dark:text-gray-400">
                      {" "}
                      / A certificate of nationality.
                    </em>
                  </p>
                )}

                {specification.carte_nationale_identite && (
                  <p className="text-gray-700 leading-relaxed dark:text-white!">
                    • Une photocopie de la carte nationale d'identité.
                    <em className="text-gray-600 dark:text-gray-400">
                      {" "}
                      / A photocopy of the national identity card.
                    </em>
                  </p>
                )}

                {specification.photo && (
                  <p className="text-gray-700 leading-relaxed dark:text-white!">
                    • Quatre (04) photos d'identité 4x4 du candidat.
                    <em className="text-gray-600 dark:text-gray-400">
                      {" "}
                      / Four (04) 4x4 identity photos of the candidate.
                    </em>
                  </p>
                )}

                <p className="text-gray-700 leading-relaxed dark:text-white!">
                  • Un certificat médical signé par un médecin fonctionnaire,
                  datant de moins de trois (03) mois et certifiant que le
                  candidat est apte à poursuivre des études supérieures.
                  <em className="text-gray-600 dark:text-gray-400">
                    {" "}
                    / A medical certificate issued within the last three (03)
                    months by a state medical practitioner, and testifying that
                    the candidate is fit for higher education.
                  </em>
                </p>

                <p className="text-gray-700 leading-relaxed dark:text-white!">
                  • Un reçu de versement bancaire d'un montant de{" "}
                  {formatCurrency(frais?.montant_frais || 0)} FCFA.
                  <em className="text-gray-600 dark:text-gray-400">
                    {" "}
                    / A bank deposit receipt of{" "}
                    {formatCurrency(frais?.montant_frais || 0)} CFA francs.
                  </em>
                </p>

                <p className="text-gray-700 leading-relaxed dark:text-white!">
                  • Une enveloppe A4 timbrée au tarif intérieur réglementaire et
                  portant l'adresse exacte du candidat.
                  <em className="text-gray-600 dark:text-gray-400">
                    {" "}
                    / A 21 x 29.7 size self-addressed envelope bearing a 400 CFA
                    francs postal stamp.
                  </em>
                </p>

                {specification.desc_infos_concours && (
                  <p className="text-gray-600 italic mt-4 pt-4 border-t">
                    {specification.desc_infos_concours}
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </section>
      )}

      {/* Informations bancaires */}
      {frais && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="w-6 h-6 text-primary" />
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-400">
              Informations de paiement
            </h2>
          </div>

          <Card className="border-2 border-primary/20 bg-primary/5">
            <CardContent className="p-4 md:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Banque
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white!">
                    {frais.nom_banque}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Numéro de compte
                  </p>
                  <p className="text-lg font-semibold text-gray-900 font-mono dark:text-white!">
                    {frais.numero_compte}
                  </p>
                </div>

                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Montant à verser
                  </p>
                  <p className="text-2xl font-bold text-primary ">
                    {formatCurrency(frais.montant_frais)} FCFA
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      <section className="pt-6 pb-4">
        <p className="mb-2">
          Pour plus d'informations, veuillez contacter l'école :
        </p>
        {ecole?.telephone_ecole && (
          <p className="text-gray-600 dark:text-gray-400">
            • Contact : {ecole.telephone_ecole}
          </p>
        )}
        {ecole?.email_ecole && (
          <p className="text-gray-600 dark:text-gray-400">
            • Email : {ecole.email_ecole}
          </p>
        )}
        {ecole?.siteweb_ecole && (
          <a
            href={ecole.siteweb_ecole}
            className="text-gray-600 hover:underline block dark:text-gray-400"
            target="_blank"
            rel="noopener noreferrer"
          >
            • Site web : {ecole.siteweb_ecole}
          </a>
        )}
      </section>

      {/* CTA */}
      {!isInscrit ? (
        <section className="text-center pt-6 pb-4">
          <Button
            onClick={() => navigate(`/concours/${id}/enrolment`)}
            size="lg"
            className="px-6 md:px-8 py-4 md:py-6 text-base md:text-lg font-semibold cursor-pointer w-full md:w-auto"
          >
            S'inscrire à ce concours
          </Button>
        </section>
      ) : (
        <section className="text-center pt-6 pb-4">
          <Button
            onClick={() => navigate(`/mes-candidatures`)}
            size="lg"
            className="px-6 md:px-8 py-4 md:py-6 text-base md:text-lg font-semibold cursor-pointer w-full md:w-auto"
          >
            Voir ma candidature
          </Button>
        </section>
      )}
    </main>
  );
};

export default EntranceExamDetails;
