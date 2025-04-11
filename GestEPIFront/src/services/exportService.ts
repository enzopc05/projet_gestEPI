import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // Importation explicite
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import format from 'date-fns/format';
import fr from 'date-fns/locale/fr';
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
  
  // Utilisation d'autoTable avec l'importation explicite
  autoTable(doc, {
    body: generalStats,
    startY: 50,
    theme: 'plain',
    styles: { fontSize: 12 }
  });
  
  // Répartition par type
  doc.setFontSize(14);
  const finalY1 = (doc as any).lastAutoTable?.finalY || 70;
  doc.text('Répartition par type', 14, finalY1 + 15);
  
  const typeStats = stats.epiByType.map((item: any) => [item.typeName, item.count.toString()]);
  
  autoTable(doc, {
    head: [['Type', 'Nombre']],
    body: typeStats,
    startY: finalY1 + 20,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [41, 128, 185] }
  });
  
  // Répartition par statut
  doc.setFontSize(14);
  const finalY2 = (doc as any).lastAutoTable?.finalY || (finalY1 + 60);
  doc.text('Répartition par statut', 14, finalY2 + 15);
  
  const statusStats = stats.epiByStatus.map((item: any) => [item.statusName, item.count.toString()]);
  
  autoTable(doc, {
    head: [['Statut', 'Nombre']],
    body: statusStats,
    startY: finalY2 + 20,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [41, 128, 185] }
  });
  
  // Historique des vérifications
  if (stats.checksHistory && stats.checksHistory.length > 0) {
    doc.addPage();
    doc.setFontSize(14);
    doc.text('Historique des vérifications', 14, 20);
    
    const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
    const historyStats = stats.checksHistory.map((item: any) => {
      if (!item.month) return ['Inconnu', item.count.toString()];
      const [year, month] = item.month.split('-');
      return [`${monthNames[parseInt(month) - 1]} ${year}`, item.count.toString()];
    });
    
    autoTable(doc, {
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
  autoTable(doc, {
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

// Fonction pour exporter la liste des EPIs en PDF
export const exportEPIListToPDF = (epis: EPI[]) => {
  const doc = new jsPDF();
  
  // Titre du document
  doc.setFontSize(18);
  doc.text('Liste des EPIs', 14, 22);
  
  // Date d'exportation
  doc.setFontSize(11);
  doc.text(`Exporté le ${format(new Date(), 'dd/MM/yyyy', { locale: fr })}`, 14, 30);
  
  // Préparation des données pour le tableau
  const tableColumn = ["Marque", "Modèle", "N° de série", "Type", "Statut"];
  const tableRows = epis.map(epi => [
    epi.brand || '',
    epi.model || '',
    epi.serialNumber || '',
    epi.typeName || '',
    epi.statusName || ''
  ]);
  
  // Ajout du tableau au document
  autoTable(doc, {
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
  doc.save('liste_epis.pdf');
};

// Fonction pour exporter la liste des EPIs en Excel
export const exportEPIListToExcel = (epis: EPI[]) => {
  // Préparation des données
  const worksheet = XLSX.utils.json_to_sheet(epis.map(epi => ({
    "Marque": epi.brand || '',
    "Modèle": epi.model || '',
    "N° de série": epi.serialNumber || '',
    "Taille": epi.size || '',
    "Couleur": epi.color || '',
    "Type": epi.typeName || '',
    "Statut": epi.statusName || '',
    "Date d'achat": formatDate(epi.purchaseDate)
  })));
  
  // Création du workbook et ajout de la feuille
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "EPIs");
  
  // Génération du fichier
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
  // Sauvegarde du fichier
  saveAs(data, 'liste_epis.xlsx');
};

// Fonction pour exporter la liste des vérifications en PDF
export const exportCheckListToPDF = (checks: EPICheck[]) => {
  const doc = new jsPDF();
  
  // Titre du document
  doc.setFontSize(18);
  doc.text('Liste des Vérifications', 14, 22);
  
  // Date d'exportation
  doc.setFontSize(11);
  doc.text(`Exporté le ${format(new Date(), 'dd/MM/yyyy', { locale: fr })}`, 14, 30);
  
  // Préparation des données pour le tableau
  const tableColumn = ["Date", "Équipement", "Vérificateur", "Statut", "Remarques"];
  const tableRows = checks.map(check => [
    formatDate(check.checkDate) || '',
    check.epiSerialNumber || '',
    check.userName || '',
    check.statusName || '',
    (check.remarks || '').substring(0, 40) + ((check.remarks && check.remarks.length > 40) ? '...' : '')
  ]);
  
  // Ajout du tableau au document
  autoTable(doc, {
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
  doc.save('liste_verifications.pdf');
};

// Fonction pour exporter la liste des vérifications en Excel
export const exportCheckListToExcel = (checks: EPICheck[]) => {
  // Préparation des données
  const worksheet = XLSX.utils.json_to_sheet(checks.map(check => ({
    "Date": formatDate(check.checkDate) || '',
    "Équipement": check.epiSerialNumber || '',
    "Vérificateur": check.userName || '',
    "Statut": check.statusName || '',
    "Remarques": check.remarks || ''
  })));
  
  // Création du workbook et ajout de la feuille
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Vérifications");
  
  // Génération du fichier
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
  // Sauvegarde du fichier
  saveAs(data, 'liste_verifications.xlsx');
};

// Fonction utilitaire pour formater les dates
const formatDate = (date: Date | string | undefined): string => {
  if (!date) return '';
  try {
    return format(new Date(date), 'dd/MM/yyyy', { locale: fr });
  } catch (error) {
    console.error('Erreur de formatage de date:', error);
    return '';
  }
};