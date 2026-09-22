# 🔬 Open-Forensics — Simulateur d'Entraînement aux Shifts DFIR

**Open-Forensics** est une application web open-source et interactive conçue pour s'entraîner aux investigations numériques et à la réponse à incidents (DFIR - Digital Forensics and Incident Response).

---

## 🎯 Scénarios Inclus (7 Scénarios Pratiques)

| Scénario | Catégorie | Difficulté | Techniques MITRE |
|---|---|---|---|
| **Détection d'Injection de Processus** | Analyse Mémoire (RAM) | Moyen | `T1055` |
| **Mécanismes de Persistance** | Analyse Disque (Prefetch, Amcache) | Moyen | `T1547.001` |
| **Détection de Mouvement Latéral** | Analyse de Logs (Event IDs Windows) | Difficile | `T1021` |
| **Reconstruction de Timeline** | Timeline Forensique | Difficile | `T1566`, `T1059` |
| **Détection d'Exfiltration DNS** | Analyse Réseau (PCAP) | Moyen | `T1048` |
| **Artefacts Navigateur** | Forensic Web (Historique, Cache, Cookies) | Facile | `T1566.002` |
| **Persistance via Registre** | Registre Windows (Run Keys, Services) | Moyen | `T1547.001` |

---

## 🚀 Lancement Rapide

Dans le dossier `Open-Forensics` :

```bash
# Lancer le serveur de développement (Vite)
npm run dev

# Compiler pour la production
npm run build

# Prévisualiser la version de production
npm run preview
```

---

## 🌟 Fonctionnalités

- 🌐 **Bilingue (i18n)** : Français et Anglais avec bascule instantanée.
- 🌙 **Mode Sombre & Thème Cyber** : Interface pensée pour les analystes forensiques.
- 🔍 **Visualiseur d'Artéfacts Avancé** : Processus en mémoire, flux réseau, fichiers prefetch, logs d'événements, clés de registre.
- ⏱️ **Chronomètre d'Investigation** : Mesure du temps passé par cas.
- 📊 **Système d'Évaluation Forensique** : Note (A+, A, B, C, D, F), feedback détaillé et explications complètes.
- 🗺️ **Mapping MITRE ATT&CK** : Corrélation avec les tactiques et techniques d'attaque.
- 💾 **Persistance Locale** : Sauvegarde automatique de la progression dans le navigateur (`localStorage`).
