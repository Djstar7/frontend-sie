export const allDocument = {
  administratifs: [
    {
      name: 'Formulaire de demande de visa',
      guide: 'Télécharger le formulaire officiel sur le site de l’ambassade.',
      validation: { required: true, fileTypes: ['pdf'], maxSizeMB: 2 },
    },
    {
      name: 'Passeport valide',
      guide: 'Passeport valable au moins 6 mois après la date de retour.',
      validation: { required: true, fileTypes: ['pdf', 'jpg', 'png'], maxSizeMB: 5 },
    },
    {
      name: 'Photocopies du passeport',
      guide: 'Toutes les pages importantes (photo, visas, tampons).',
      validation: { required: true, fileTypes: ['pdf'], maxSizeMB: 3 },
    },
    {
      name: 'Carte nationale d’identité',
      guide: 'Copie recto-verso de la CNI en cours de validité.',
      validation: { required: true, fileTypes: ['pdf', 'jpg', 'png'], maxSizeMB: 3 },
    },
    {
      name: 'Photographies d’identité',
      guide: 'Photos récentes aux normes biométriques (format passeport).',
      validation: { required: true, fileTypes: ['jpg', 'png'], maxSizeMB: 2 },
    },
    {
      name: 'Acte de naissance',
      guide: 'Copie intégrale de l’acte de naissance.',
      validation: { required: true, fileTypes: ['pdf'], maxSizeMB: 2 },
    },
    {
      name: 'Acte de mariage',
      guide: 'Copie intégrale en cas de mariage.',
      validation: { required: true, fileTypes: ['pdf'], maxSizeMB: 2 },
    },
    {
      name: 'Acte de divorce',
      guide: 'Jugement de divorce le cas échéant.',
      validation: { required: true, fileTypes: ['pdf'], maxSizeMB: 2 },
    },
    {
      name: 'Livret de famille',
      guide: 'Pages concernant le demandeur et les enfants.',
      validation: { required: true, fileTypes: ['pdf'], maxSizeMB: 3 },
    },
    {
      name: 'Autorisation parentale pour mineur',
      guide: 'Lettre signée par les parents + copie de leurs pièces d’identité.',
      validation: { required: true, fileTypes: ['pdf'], maxSizeMB: 2 },
    },
  ],

  financiers: [
    {
      name: 'Preuve de paiement des frais de visa',
      guide: 'Reçu ou justificatif du paiement effectué.',
      validation: { required: true, fileTypes: ['pdf', 'jpg'], maxSizeMB: 2 },
    },
    {
      name: 'Relevés bancaires (3 à 6 derniers mois)',
      guide: 'Scanner vos relevés bancaires en PDF lisible.',
      validation: { required: true, fileTypes: ['pdf'], maxSizeMB: 10 },
    },
    {
      name: 'Attestation de prise en charge / Lettre de sponsor',
      guide: 'Lettre signée + pièce d’identité du garant.',
      validation: { required: true, fileTypes: ['pdf'], maxSizeMB: 5 },
    },
    {
      name: 'Bulletins de salaire',
      guide: '3 derniers bulletins de salaire du demandeur.',
      validation: { required: true, fileTypes: ['pdf'], maxSizeMB: 5 },
    },
    {
      name: 'Attestation de travail',
      guide: 'Lettre de l’employeur confirmant le poste et l’ancienneté.',
      validation: { required: true, fileTypes: ['pdf'], maxSizeMB: 3 },
    },
    {
      name: 'Contrat de travail',
      guide: 'Copie signée de votre contrat de travail.',
      validation: { required: true, fileTypes: ['pdf'], maxSizeMB: 5 },
    },
    {
      name: 'Déclaration d’impôts / Avis d’imposition',
      guide: 'Dernière déclaration ou avis officiel.',
      validation: { required: true, fileTypes: ['pdf'], maxSizeMB: 5 },
    },
    {
      name: 'Justificatifs de biens',
      guide: 'Titres de propriété, certificats de véhicule, etc.',
      validation: { required: true, fileTypes: ['pdf', 'jpg'], maxSizeMB: 5 },
    },
  ],

  voyage: [
    {
      name: 'Réservation d’hôtel ou attestation d’hébergement',
      guide: 'Réservation confirmée ou lettre de l’hébergeant.',
      validation: { required: true, fileTypes: ['pdf', 'jpg'], maxSizeMB: 3 },
    },
    {
      name: 'Lettre d’invitation',
      guide: 'Lettre officielle de la personne ou institution qui vous invite.',
      validation: { required: true, fileTypes: ['pdf'], maxSizeMB: 3 },
    },
    {
      name: 'Billet d’avion (aller-retour ou réservation)',
      guide: 'Billet confirmé ou réservation avec dates précises.',
      validation: { required: true, fileTypes: ['pdf'], maxSizeMB: 5 },
    },
    {
      name: 'Assurance voyage',
      guide: 'Attestation d’assurance couvrant toute la durée du séjour.',
      validation: { required: true, fileTypes: ['pdf'], maxSizeMB: 2 },
    },
    {
      name: 'Itinéraire de voyage détaillé',
      guide: 'Plan de séjour avec lieux et dates.',
      validation: { required: true, fileTypes: ['pdf'], maxSizeMB: 2 },
    },
  ],

  académiques_professionnels: [
    {
      name: 'Lettre de motivation',
      guide: 'Lettre expliquant les raisons de la demande et le projet.',
      validation: { required: true, fileTypes: ['pdf'], maxSizeMB: 2 },
    },
    {
      name: 'Lettre d’admission (études)',
      guide: 'Lettre officielle de l’université ou école.',
      validation: { required: true, fileTypes: ['pdf'], maxSizeMB: 3 },
    },
    {
      name: 'Preuve de paiement des frais de scolarité',
      guide: 'Reçu de paiement de l’établissement scolaire.',
      validation: { required: true, fileTypes: ['pdf'], maxSizeMB: 3 },
    },
    {
      name: 'Diplômes / certificats / relevés de notes',
      guide: 'Copies certifiées conformes des diplômes obtenus.',
      validation: { required: true, fileTypes: ['pdf'], maxSizeMB: 10 },
    },
    {
      name: 'Lettre d’invitation d’une entreprise',
      guide: 'Lettre signée précisant l’objet du voyage professionnel.',
      validation: { required: true, fileTypes: ['pdf'], maxSizeMB: 3 },
    },
    {
      name: 'Preuve d’inscription à un congrès',
      guide: 'Justificatif officiel de l’inscription.',
      validation: { required: true, fileTypes: ['pdf'], maxSizeMB: 3 },
    },
  ],

  médicaux_judiciaires: [
    {
      name: 'Certificat médical',
      guide: 'Certificat signé par un médecin agréé.',
      validation: { required: true, fileTypes: ['pdf', 'jpg'], maxSizeMB: 2 },
    },
    {
      name: 'Carnet de vaccination',
      guide: 'Pages attestant des vaccinations obligatoires.',
      validation: { required: true, fileTypes: ['pdf', 'jpg', 'png'], maxSizeMB: 3 },
    },
    {
      name: 'Casier judiciaire récent',
      guide: 'Extrait du casier judiciaire de moins de 3 mois.',
      validation: { required: true, fileTypes: ['pdf'], maxSizeMB: 2 },
    },
    {
      name: 'Test de dépistage (VIH, tuberculose, COVID)',
      guide: 'Résultats des tests récents exigés.',
      validation: { required: true, fileTypes: ['pdf'], maxSizeMB: 2 },
    },
  ],

  autres: [
    {
      name: 'Lettre d’engagement de retour au pays',
      guide: 'Déclaration signée du demandeur.',
      validation: { required: true, fileTypes: ['pdf'], maxSizeMB: 2 },
    },
    {
      name: 'Attestation d’employeur de congé',
      guide: 'Lettre signée confirmant la durée du congé.',
      validation: { required: true, fileTypes: ['pdf'], maxSizeMB: 2 },
    },
    {
      name: 'Certificat de scolarité (mineur)',
      guide: 'Certificat récent de l’établissement fréquenté.',
      validation: { required: true, fileTypes: ['pdf'], maxSizeMB: 2 },
    },
    {
      name: 'Preuve de ressources du garant',
      guide: 'Attestation bancaire, fiches de paie ou autres justificatifs.',
      validation: { required: true, fileTypes: ['pdf'], maxSizeMB: 5 },
    },
    {
      name: 'Autorisation de sortie du territoire',
      guide: 'Document officiel pour les mineurs voyageant seuls.',
      validation: { required: true, fileTypes: ['pdf'], maxSizeMB: 2 },
    },
    {
      name: 'Lettre explicative',
      guide: 'Lettre justifiant une situation particulière.',
      validation: { required: true, fileTypes: ['pdf'], maxSizeMB: 2 },
    },
  ],
}
