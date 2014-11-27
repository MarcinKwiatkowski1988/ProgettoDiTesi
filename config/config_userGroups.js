var userGroups = { 
	"defaultGroup": { // do not MOD this one -> access to all paths
		"desc": "Gruppo di default: ha autorizzazione completa, ovvero l' utente pu&oacute accedere a qualsiasi gruppo di percorsi.",
		"accessiblePaths": [ jsPaths_1, jsPaths_2, jsPaths_3 ] }, 
	"Amministratore": {
		"desc": "Questo gruppo ha accesso a quasi tutti i percorsi disponibili e conseguentemente a quasi tutte le zone visitabili.", 
		"accessiblePaths": [ jsPaths_1, jsPaths_2 ] },
	"Tecnico1": { 
		"desc": "Questo gruppo di tecnici ha i permessi solo per un unico percorso che contiene i server su cui devono fare manutenzione.",
		"accessiblePaths": [ jsPaths_1 ] },
	"Visitatore": { 
		"desc": "Possiede i permessi minimi per poter visitare solo le zone di relativo interesse",
		"accessiblePaths": [ jsPaths_3 ] } 	 		 	 	 		 		 	 		 		 	 	
};