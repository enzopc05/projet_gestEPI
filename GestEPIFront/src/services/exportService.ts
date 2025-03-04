// À ajouter dans GestEPIFront/src/services/exportService.ts
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { EPI, EPICheck, User } from '../types';

// Fonction pour exporter des statistiques du dashboard en PDF
export const exportDashboardStatsToPDF = (stats: any) => {
  const doc = new jsPDF();
  
  // Titre
  doc.setFontSize(18);
  doc.text('Rapport statistique GestEPI', 14, 22);
  
  // Date
  doc.setFontSize(11);
  doc.text(`Généré le ${format(new Date(), 'dd/MM/yyyy', { locale: fr })}`, 14, 30);
  
  // Statistiques générales
  doc.setFontSize(14);
  doc.text('Statistiques générales', 14, 45);
  
  const operationalPercentage = stats.epiCount > 0 
    ? Math.round((stats.epiByStatus.find((s: any) => s.statusName === 'Opérationnel')?.count || 0) / stats.epiCount * 100) 
    : 0;
  
  const generalStats = [
    ['Nombre total d\'EPIs', stats.epiCount.toString()],
    ['EPIs opérationnels', `${operationalPercentage}%`],
    ['Vérifications urgentes', stats.pendingChecks.urgent.toString()],
    ['Vérifications à venir', (stats.pendingChecks.soon + stats.pendingChecks.upcoming).toString()]
  ];
  
  (doc as any).autoTable({
    body: generalStats,
    startY: 50,
    theme: 'plain',
    styles: { fontSize: 12 }
  });
  
  // Répartition par type
  doc.setFontSize(14);
  doc.text('Répartition par type', 14, (doc as any).lastAutoTable.finalY + 15);
  
  const typeStats = stats.epiByType.map((item: any) => [item.typeName, item.count.toString()]);
  
  (doc as any).autoTable({
    head: [['Type', 'Nombre']],
    body: typeStats,
    startY: (doc as any).lastAutoTable.finalY + 20,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [41, 128, 185] }
  });
  
  // Répartition par statut
  doc.setFontSize(14);
  doc.text('Répartition par statut', 14, (doc as any).lastAutoTable.finalY + 15);
  
  const statusStats = stats.epiByStatus.map((item: any) => [item.statusName, item.count.toString()]);
  
  (doc as any).autoTable({
    head: [['Statut', 'Nombre']],
    body: statusStats,
    startY: (doc as any).lastAutoTable.finalY + 20,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [41, 128, 185] }
  });
  
  // Historique des vérifications
  if (stats.checksHistory.length > 0) {
    doc.addPage();
    doc.setFontSize(14);
    doc.text('Historique des vérifications', 14, 20);
    
    const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
    const historyStats = stats.checksHistory.map((item: any) => {
      const [year, month] = item.month.split('-');
      return [`${monthNames[parseInt(month) - 1]} ${year}`, item.count.toString()];
    });
    
    (doc as any).autoTable({
      head: [['Mois', 'Nombre de vérifications']],
      body: historyStats,
      startY: 25,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [41, 128, 185] }
    });
  }
  
  // Sauvegarde
  doc.save('rapport_statistique.pdf');
};

// Fonction pour exporter la liste des utilisateurs en PDF
export const exportUserListToPDF = (users: User[]) => {
  const doc = new jsPDF();
  
  // Titre du document
  doc.setFontSize(18);
  doc.text('Liste des Utilisateurs', 14, 22);
  
  // Date d'exportation
  doc.setFontSize(11);
  doc.text(`Exporté le ${format(new Date(), 'dd/MM/yyyy', { locale: fr })}`, 14, 30);
  
  // Préparation des données pour le tableau
  const tableColumn = ["Nom", "Prénom", "Email", "Téléphone", "Rôle"];
  const tableRows = users.map(user => [
    user.lastName || '',
    user.firstName || '',
    user.email || '',
    user.phone || '',
    user.typeName || ''
  ]);
  
  // Ajout du tableau au document
  (doc as any).autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 40,
    styles: {
      fontSize: 10,
      cellPadding: 3,
      valign: 'middle'
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240]
    }
  });
  
  // Sauvegarde du document
  doc.save('liste_utilisateurs.pdf');
};

// Fonction pour exporter la liste des utilisateurs en Excel
export const exportUserListToExcel = (users: User[]) => {
  // Préparation des données
  const worksheet = XLSX.utils.json_to_sheet(users.map(user => ({
    "Nom": user.lastName || '',
    "Prénom": user.firstName || '',
    "Email": user.email || '',
    "Téléphone": user.phone || '',
    "Rôle": user.typeName || ''
  })));
  
  // Création du workbook et ajout de la feuille
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Utilisateurs");
  
  // Génération du fichier
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
  // Sauvegarde du fichier
  saveAs(data, 'liste_utilisateurs.xlsx');
};