import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { EPI, EPICheck } from '../types';

// Fonction utilitaire pour formater les dates
const formatDate = (date: Date | string | undefined) => {
  if (!date) return '';
  return format(new Date(date), 'dd/MM/yyyy', { locale: fr });
};

// Exportation de la liste des EPIs au format PDF
export const exportEPIListToPDF = (epis: EPI[]) => {
  const doc = new jsPDF();
  
  // Titre du document
  doc.setFontSize(18);
  doc.text('Liste des Équipements de Protection Individuelle', 14, 22);
  
  // Date d'exportation
  doc.setFontSize(11);
  doc.text(`Exporté le ${formatDate(new Date())}`, 14, 30);
  
  // Préparation des données pour le tableau
  const tableColumn = ["Marque", "Modèle", "N° de série", "Type", "Statut", "Date achat", "Dernière vérif."];
  const tableRows = epis.map(epi => [
    epi.brand,
    epi.model,
    epi.serialNumber,
    epi.typeName || '',
    epi.statusName || '',
    formatDate(epi.purchaseDate),
    '' // On pourrait ajouter la date de dernière vérification si disponible
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
  doc.save('liste_epi.pdf');
};

// Exportation des vérifications au format PDF
export const exportCheckListToPDF = (checks: EPICheck[]) => {
  const doc = new jsPDF();
  
  // Titre du document
  doc.setFontSize(18);
  doc.text('Historique des vérifications', 14, 22);
  
  // Date d'exportation
  doc.setFontSize(11);
  doc.text(`Exporté le ${formatDate(new Date())}`, 14, 30);
  
  // Préparation des données pour le tableau
  const tableColumn = ["Date", "Équipement", "Vérificateur", "Statut", "Remarques"];
  const tableRows = checks.map(check => [
    formatDate(check.checkDate),
    check.epiSerialNumber || '',
    check.userName || '',
    check.statusName || '',
    check.remarks || ''
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
    },
    columnStyles: {
      4: { cellWidth: 50 } // Largeur plus grande pour la colonne des remarques
    }
  });
  
  // Sauvegarde du document
  doc.save('historique_verifications.pdf');
};

// Exportation de la liste des EPIs au format Excel
export const exportEPIListToExcel = (epis: EPI[]) => {
  // Préparation des données
  const worksheet = XLSX.utils.json_to_sheet(epis.map(epi => ({
    "Marque": epi.brand,
    "Modèle": epi.model,
    "N° de série": epi.serialNumber,
    "Taille": epi.size || '',
    "Couleur": epi.color || '',
    "Type": epi.typeName || '',
    "Statut": epi.statusName || '',
    "Date d'achat": formatDate(epi.purchaseDate),
    "Date de fabrication": formatDate(epi.manufactureDate),
    "Date de mise en service": formatDate(epi.serviceStartDate),
    "Périodicité (mois)": epi.periodicity,
    "Date de fin de vie": formatDate(epi.endOfLifeDate)
  })));
  
  // Création du workbook et ajout de la feuille
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "EPIs");
  
  // Génération du fichier
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
  // Sauvegarde du fichier
  saveAs(data, 'liste_epi.xlsx');
};

// Exportation des vérifications au format Excel
export const exportCheckListToExcel = (checks: EPICheck[]) => {
  // Préparation des données
  const worksheet = XLSX.utils.json_to_sheet(checks.map(check => ({
    "Date": formatDate(check.checkDate),
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
  saveAs(data, 'historique_verifications.xlsx');
};