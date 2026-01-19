/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getConcoursById } from "@/store/concours/concoursSlice";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, GraduationCap, Clock, Building2, CreditCard } from "lucide-react";
import type { RootState, AppDispatch } from "@/store/store";

const EntranceExamDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { selected, loading, error } = useSelector(
    (state: RootState) => state.concours
  );

  const formatDate = (dt: Date) => {
    const date = new Date(dt);
    const day = date.getDate();
    const month = date.toLocaleString("fr-FR", { month: "long" });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount);
  };

  useEffect(() => {
    if (id && (!selected || selected.id !== parseInt(id))) {
      dispatch(getConcoursById(id));
    }
  }, [id, dispatch, selected]);

  if (loading) {
    return <div className="py-20 text-center">Chargement du concours...</div>;
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
      {/* Header avec logo */}
      <div className="relative p-2 md:p-10 mb-2 h-100 flex justify-between items-center rounded-2xl!">
        {/* Section de la bannière */}
        {ecole?.banniere_url && (
          <div className="absolute inset-0 z-0">
            <img 
              src={ecole.banniere_url.startsWith('http') 
                ? ecole.banniere_url 
                : `${import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:8000'}/storage/${ecole.banniere_url}`}
              alt={`Bannière ${ecole.libelle_ecole}`}
              className="w-full h-full object-cover rounded-2xl!"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            {/* Overlay sombre pour améliorer la lisibilité */}
            <div className="absolute inset-0 bg-black/35 z-10 rounded-2xl!"></div>
          </div>
        )}

        {/* Contenu principal */}
        <div className="relative z-20 text-white w-full">
          <section className="w-full">
            <Badge className="bg-white/70 text-secondary border border-primary/20 mb-4">
              Concours officiel
            </Badge>
            
            <div className="flex items-start justify-between gap-6 flex-wrap w-full!">
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl md:text-4xl font-bold mb-3">
                  {selected.libelle_concours}
                </h1>
                <p className="text-[12px] md:text-lg font-bold leading-relaxed">
                  {ecole?.libelle_ecole && `${ecole.libelle_ecole} — `}
                  {session?.libelle_session}
                </p>
              </div>
              
              {ecole?.logo_url && (
                <div className="flex-shrink-0">
                  <img 
                    src={ecole.logo_url.startsWith('http') 
                      ? ecole.logo_url 
                      : `${import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:8000'}/storage/${ecole.logo_url}`}
                    alt={`Logo ${ecole.libelle_ecole}`}
                    className="w-20 h-20 md:w-28 md:h-28 object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
            
          </section>
        </div>
      </div>
      <section className="mb-8">
        <div className="mt-4">
              <p className="text-sm  leading-relaxed">
                   {ecole?.libelle_ecole && <><strong>{ecole.libelle_ecole}</strong> </>}
                lance un concours d'entrée pour la {session?.libelle_session || 'session en cours'}
                {selected.concours_filieres && selected.concours_filieres.length > 0 && (
                  <>
                    {' '}dans {selected.concours_filieres.length > 1 ? 'les filières' : 'la filière'} {selected.concours_filieres.map((cf: any, idx: number) => {
                      const niveaux = cf.filiere?.niveaux || [];
                      const niveauxStr = niveaux.length > 0 
                        ? ` (${niveaux.map((n: any) => n.libelle_niveau || n.niveau).join(', ')})` 
                        : '';
                      return (
                        <span key={cf.id}>
                          <strong>{cf.filiere.libelle_filiere}</strong>{niveauxStr}
                          {idx === selected.concours_filieres.length - 2 ? ' et ' : idx < selected.concours_filieres.length - 1 ? ', ' : ''}
                        </span>
                      );
                    })}.
                  </>
                )}
                {!selected.concours_filieres?.length && '.'}
              </p>
            </div>
      </section>

      {/* Infos clés */}
      <Card className="mb-8 border-2">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Date limite d'inscription</p>
                <p className="font-semibold text-gray-900">{formatDate(selected.date_limite)}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Date de l'examen</p>
                <p className="font-semibold text-gray-900">{formatDate(selected.date_examen)}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CreditCard className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Frais d'inscription</p>
                <p className="font-semibold text-gray-900">{formatCurrency(frais?.montant_frais || 0)} FCFA</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filières disponibles */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <GraduationCap className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold text-gray-900">Filières disponibles</h2>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-700 leading-relaxed">
              {selected.concours_filieres?.map((cf: any, index: number) => (
                <span key={cf.id}>
                  <strong>{cf.filiere.libelle_filiere}</strong> ({cf.nbre_places} places) — {cf.filiere.departement.libelle_departement}
                  {index < selected.concours_filieres.length - 1 ? " • " : ""}
                </span>
              ))}
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Documents nécessaires */}
      {specification && (
        <section className="mb-8">
          <div className="bg-red-600 text-white px-6 py-3 font-semibold text-lg">
            Documents Nécessaires / Necessary Documents
          </div>
          
          <Card className="rounded-t-none border-t-0">
            <CardContent className="p-6 space-y-3">
              {specification.acte_naissance && (
                <p className="text-gray-700 leading-relaxed">
                  • Une photocopie certifiée d'acte de naissance datant de moins de trois (03) mois. 
                  <em className="text-gray-600"> / A certified true photocopy of the birth certificate issued within the last three (03) months.</em>
                </p>
              )}

              {specification.diplomes && (
                <p className="text-gray-700 leading-relaxed">
                  • Une photocopie certifiée conforme du diplôme/attestation requis. 
                  <em className="text-gray-600"> / A certified true copy of the required diploma.</em>
                </p>
              )}

              {specification.releve_notes && (
                <p className="text-gray-700 leading-relaxed">
                  • Un relevé de notes officiel. 
                  <em className="text-gray-600"> / An official transcript of records.</em>
                </p>
              )}

              {specification.certificat_nationalite && (
                <p className="text-gray-700 leading-relaxed">
                  • Un certificat de nationalité. 
                  <em className="text-gray-600"> / A certificate of nationality.</em>
                </p>
              )}

              {specification.carte_nationale_identite && (
                <p className="text-gray-700 leading-relaxed">
                  • Une photocopie de la carte nationale d'identité. 
                  <em className="text-gray-600"> / A photocopy of the national identity card.</em>
                </p>
              )}

              {specification.photo && (
                <p className="text-gray-700 leading-relaxed">
                  • Quatre (04) photos d'identité 4x4 du candidat. 
                  <em className="text-gray-600"> / Four (04) 4x4 identity photos of the candidate.</em>
                </p>
              )}

              <p className="text-gray-700 leading-relaxed">
                • Un certificat médical signé par un médecin fonctionnaire, datant de moins de trois (03) mois et certifiant que le candidat est apte à poursuivre des études supérieures. 
                <em className="text-gray-600"> / A medical certificate issued within the last three (03) months by a state medical practitioner, and testifying that the candidate is fit for higher education.</em>
              </p>

              <p className="text-gray-700 leading-relaxed">
                • Un reçu de versement bancaire d'un montant de {formatCurrency(frais?.montant_frais || 0)} FCFA. 
                <em className="text-gray-600"> / A bank deposit receipt of {formatCurrency(frais?.montant_frais || 0)} CFA francs.</em>
              </p>

              <p className="text-gray-700 leading-relaxed">
                • Une enveloppe A4 timbrée au tarif intérieur réglementaire et portant l'adresse exacte du candidat. 
                <em className="text-gray-600"> / A 21 x 29.7 size self-addressed envelope bearing a 400 CFA francs postal stamp.</em>
              </p>

              {specification.desc_infos_concours && (
                <p className="text-gray-600 italic mt-4 pt-4 border-t">
                  {specification.desc_infos_concours}
                </p>
              )}
            </CardContent>
          </Card>
        </section>
      )}

      {/* Informations bancaires */}
      {frais && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-gray-900">Informations de paiement</h2>
          </div>
          
          <Card className="border-2 border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Banque</p>
                  <p className="text-lg font-semibold text-gray-900">{frais.nom_banque}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Numéro de compte</p>
                  <p className="text-lg font-semibold text-gray-900 font-mono">{frais.numero_compte}</p>
                </div>
                
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-gray-600 mb-1">Montant à verser</p>
                  <p className="text-2xl font-bold text-primary">{formatCurrency(frais.montant_frais)} FCFA</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      <section className="pt-6 pb-4">
        <p>Pour plus d'informations, Veuillez contacter l'école :</p>
        {
            ecole?.telephone_ecole && <p className="text-gray-600 italic">• Contact: {ecole.telephone_ecole}</p>
        }
        {
            ecole?.email_ecole && <p className="text-gray-600 italic">• Email: {ecole.email_ecole}</p>
        }
        {
            ecole?.siteweb_ecole && <a href={ecole.siteweb_ecole} className="text-gray-600 italic hover:underline">• Site web: {ecole.siteweb_ecole}</a>
        }
      </section>

      {/* CTA */}
      <section className="text-center pt-6 pb-4">
        <Button onClick={() => navigate(`/concours/${id}/enrolment`)} size="lg" className="px-8 py-6 text-lg font-semibold cursor-pointer">
          S'inscrire à ce concours
        </Button>
      </section>
    </main>
  );
};

export default EntranceExamDetails;