export type Lang = "it" | "en" | "fr" | "de";

const SUPPORTED: Lang[] = ["it", "en", "fr", "de"];

let _lang: Lang = "it";

export function setLang(input: string | undefined | null): Lang {
  const raw = (input || "").toLowerCase().split("-")[0];
  _lang = (SUPPORTED.includes(raw as Lang) ? raw : "it") as Lang;
  return _lang;
}

export function getLang(): Lang {
  return _lang;
}

export function t(key: string, vars?: Record<string, string | number>): string {
  const dict = STRINGS[key];
  let val = dict?.[_lang] || dict?.it || key;
  if (vars) {
    for (const k of Object.keys(vars)) {
      val = val.replace(new RegExp(`\\{${k}\\}`, "g"), String(vars[k]));
    }
  }
  return val;
}

const STRINGS: Record<string, Record<Lang, string>> = {
  // Common
  "common.cancel": { it: "Annulla", en: "Cancel", fr: "Annuler", de: "Abbrechen" },
  "common.save": { it: "Salva", en: "Save", fr: "Enregistrer", de: "Speichern" },
  "common.delete": { it: "Elimina", en: "Delete", fr: "Supprimer", de: "Löschen" },
  "common.remove": { it: "Rimuovi", en: "Remove", fr: "Retirer", de: "Entfernen" },
  "common.add": { it: "Aggiungi", en: "Add", fr: "Ajouter", de: "Hinzufügen" },
  "common.back": { it: "Indietro", en: "Back", fr: "Retour", de: "Zurück" },
  "common.next": { it: "Avanti", en: "Next", fr: "Suivant", de: "Weiter" },
  "common.confirm": { it: "Conferma", en: "Confirm", fr: "Confirmer", de: "Bestätigen" },
  "common.close": { it: "Chiudi", en: "Close", fr: "Fermer", de: "Schließen" },
  "common.reset": { it: "Reset", en: "Reset", fr: "Réinitialiser", de: "Zurücksetzen" },
  "common.default": { it: "Default", en: "Default", fr: "Défaut", de: "Standard" },
  "common.none": { it: "Nessuna", en: "None", fr: "Aucune", de: "Keine" },
  "common.search": { it: "Cerca", en: "Search", fr: "Rechercher", de: "Suchen" },
  "common.yes": { it: "Sì", en: "Yes", fr: "Oui", de: "Ja" },
  "common.no": { it: "No", en: "No", fr: "Non", de: "Nein" },
  "common.enabled": { it: "Attiva", en: "Active", fr: "Active", de: "Aktiv" },
  "common.disabled": { it: "Disattivata", en: "Disabled", fr: "Désactivée", de: "Deaktiviert" },
  "common.loading": { it: "Caricamento…", en: "Loading…", fr: "Chargement…", de: "Lädt…" },
  "common.optional": { it: "opzionale", en: "optional", fr: "facultatif", de: "optional" },
  "common.value": { it: "Valore", en: "Value", fr: "Valeur", de: "Wert" },
  "common.min": { it: "min", en: "min", fr: "min", de: "Min." },
  "common.hour_short": { it: "h", en: "h", fr: "h", de: "Std." },

  // Nav
  "nav.section.main": { it: "Principale", en: "Main", fr: "Principal", de: "Hauptmenü" },
  "nav.section.actions": { it: "Azioni", en: "Actions", fr: "Actions", de: "Aktionen" },
  "nav.overview": { it: "Panoramica", en: "Overview", fr: "Aperçu", de: "Übersicht" },
  "nav.editor": { it: "Editor", en: "Editor", fr: "Éditeur", de: "Editor" },
  "nav.week": { it: "Settimana", en: "Week", fr: "Semaine", de: "Woche" },
  "nav.weather_rules": { it: "Regole meteo", en: "Weather rules", fr: "Règles météo", de: "Wetterregeln" },
  "nav.devices": { it: "Dispositivi", en: "Devices", fr: "Appareils", de: "Geräte" },
  "nav.live": { it: "Stato live", en: "Live", fr: "Direct", de: "Live" },
  "nav.new_schedule": { it: "Nuova schedulazione", en: "New schedule", fr: "Nouvelle planification", de: "Neuer Zeitplan" },
  "nav.manage_devices": { it: "Gestisci dispositivi", en: "Manage devices", fr: "Gérer les appareils", de: "Geräte verwalten" },
  "nav.settings": { it: "Impostazioni", en: "Settings", fr: "Réglages", de: "Einstellungen" },
  "nav.menu_open": { it: "Apri menu", en: "Open menu", fr: "Ouvrir le menu", de: "Menü öffnen" },
  "nav.menu_close": { it: "Chiudi menu", en: "Close menu", fr: "Fermer le menu", de: "Menü schließen" },

  // Screen titles
  "screen.overview.title": { it: "Panoramica", en: "Overview", fr: "Aperçu", de: "Übersicht" },
  "screen.editor.title": { it: "Editor schedulazione", en: "Schedule editor", fr: "Éditeur de planification", de: "Zeitplan-Editor" },
  "screen.weather_rule.title": { it: "Regola meteo", en: "Weather rule", fr: "Règle météo", de: "Wetterregel" },
  "screen.device.title": { it: "Dispositivo", en: "Device", fr: "Appareil", de: "Gerät" },
  "screen.week.title": { it: "Vista settimanale", en: "Week view", fr: "Vue semaine", de: "Wochenansicht" },
  "screen.live.title": { it: "Stato live", en: "Live status", fr: "État en direct", de: "Live-Status" },
  "screen.wizard.title": { it: "Wizard", en: "Wizard", fr: "Assistant", de: "Assistent" },
  "screen.devices.title": { it: "Gestisci dispositivi", en: "Manage devices", fr: "Gérer les appareils", de: "Geräte verwalten" },
  "screen.settings.title": { it: "Impostazioni", en: "Settings", fr: "Réglages", de: "Einstellungen" },

  // Dirty modal
  "modal.unsaved.title": { it: "Modifiche non salvate", en: "Unsaved changes", fr: "Modifications non enregistrées", de: "Nicht gespeicherte Änderungen" },
  "modal.unsaved.body": { it: "Hai modifiche in sospeso su questa schedulazione. Vuoi davvero uscire e perderle?", en: "You have pending changes on this schedule. Leave and discard them?", fr: "Des modifications sont en attente sur cette planification. Quitter et les perdre ?", de: "Du hast noch offene Änderungen an diesem Zeitplan. Wirklich verlassen und verwerfen?" },
  "modal.unsaved.stay": { it: "Resta qui", en: "Stay", fr: "Rester", de: "Bleiben" },
  "modal.unsaved.discard": { it: "Scarta modifiche", en: "Discard changes", fr: "Ignorer", de: "Verwerfen" },
  "modal.unsaved.save": { it: "Salva ed esci", en: "Save and exit", fr: "Enregistrer et quitter", de: "Speichern und verlassen" },

  // Overview
  "overview.subtitle": { it: "Schedulazioni configurate · {n} attive su {tot}", en: "Configured schedules · {n} active of {tot}", fr: "Planifications configurées · {n} actives sur {tot}", de: "Konfigurierte Zeitpläne · {n} aktiv von {tot}" },
  "overview.kpi.active": { it: "Attive", en: "Active", fr: "Actives", de: "Aktiv" },
  "overview.kpi.weather_rules": { it: "Regole meteo", en: "Weather rules", fr: "Règles météo", de: "Wetterregeln" },
  "overview.kpi.devices": { it: "Dispositivi", en: "Devices", fr: "Appareils", de: "Geräte" },
  "overview.kpi.now": { it: "Ora corrente", en: "Now", fr: "Maintenant", de: "Jetzt" },
  "overview.no_schedules": { it: "Nessuna schedulazione", en: "No schedules", fr: "Aucune planification", de: "Keine Zeitpläne" },
  "overview.no_schedules.cta": { it: "Avvia il wizard per crearne una", en: "Start the wizard to create one", fr: "Lance l'assistant pour en créer une", de: "Starte den Assistenten, um einen zu erstellen" },
  "overview.rules_count": { it: "{n} regole", en: "{n} rules", fr: "{n} règles", de: "{n} Regeln" },

  // Editor
  "editor.field.name": { it: "Nome", en: "Name", fr: "Nom", de: "Name" },
  "editor.timeline_variant": { it: "Visualizzazione", en: "View", fr: "Affichage", de: "Ansicht" },
  "editor.add_block_hint": { it: "Clicca su una zona vuota della barra per aggiungere una fascia. Trascina i bordi per modificare durata e posizione.", en: "Click on an empty area of the bar to add a block. Drag the edges to adjust duration and position.", fr: "Clique sur une zone vide de la barre pour ajouter un créneau. Fais glisser les bords pour ajuster la durée et la position.", de: "Klicke auf einen freien Bereich der Leiste, um einen Block hinzuzufügen. Ziehe die Ränder, um Dauer und Position anzupassen." },
  "editor.block.from": { it: "Da", en: "From", fr: "De", de: "Von" },
  "editor.block.to": { it: "A", en: "To", fr: "À", de: "Bis" },
  "editor.block.action": { it: "Azione", en: "Action", fr: "Action", de: "Aktion" },
  "editor.block.delete": { it: "Elimina fascia", en: "Delete block", fr: "Supprimer le créneau", de: "Block löschen" },
  "editor.block.no_selection": { it: "Nessuna fascia selezionata. Clicca su una fascia esistente per modificarla, oppure su una zona libera per aggiungerne una nuova.", en: "No block selected. Click an existing block to edit it, or an empty area to add a new one.", fr: "Aucun créneau sélectionné. Clique sur un créneau existant pour le modifier, ou sur une zone libre pour en ajouter un.", de: "Kein Block ausgewählt. Klicke auf einen vorhandenen Block, um ihn zu bearbeiten, oder in einen freien Bereich, um einen neuen hinzuzufügen." },
  "editor.coverage": { it: "{n} fasce · totale coperto {h}h / 24h", en: "{n} blocks · total coverage {h}h / 24h", fr: "{n} créneaux · couverture totale {h}h / 24h", de: "{n} Blöcke · Abdeckung gesamt {h}h / 24h" },
  "editor.days.repeat": { it: "Ripetizione", en: "Repeat", fr: "Répétition", de: "Wiederholung" },
  "editor.days.all": { it: "Tutti i giorni", en: "Every day", fr: "Tous les jours", de: "Jeden Tag" },
  "editor.days.weekdays": { it: "Lavorativi", en: "Weekdays", fr: "Jours ouvrés", de: "Wochentags" },
  "editor.days.weekend": { it: "Weekend", en: "Weekend", fr: "Week-end", de: "Wochenende" },
  "editor.weather_rules.title": { it: "Regole meteo", en: "Weather rules", fr: "Règles météo", de: "Wetterregeln" },
  "editor.weather_rules.add": { it: "Aggiungi regola", en: "Add rule", fr: "Ajouter une règle", de: "Regel hinzufügen" },
  "editor.weather_rules.empty": { it: "Nessuna regola meteo · esecuzione fissa indipendente dal meteo", en: "No weather rules · fixed execution regardless of weather", fr: "Aucune règle météo · exécution fixe indépendamment de la météo", de: "Keine Wetterregeln · feste Ausführung unabhängig vom Wetter" },
  "editor.devices_section": { it: "Dispositivi influenzati", en: "Affected devices", fr: "Appareils concernés", de: "Betroffene Geräte" },
  "editor.devices_count": { it: "{n} selezionati", en: "{n} selected", fr: "{n} sélectionnés", de: "{n} ausgewählt" },
  "editor.dirty.unsaved": { it: "Modifiche non salvate", en: "Unsaved changes", fr: "Modifications non enregistrées", de: "Ungespeicherte Änderungen" },
  "editor.dirty.saved": { it: "Tutto salvato", en: "All saved", fr: "Tout enregistré", de: "Alles gespeichert" },

  // Wizard
  "wizard.title": { it: "Crea schedulazione", en: "Create schedule", fr: "Créer une planification", de: "Zeitplan erstellen" },
  "wizard.subtitle": { it: "Procedura guidata · puoi modificare tutto in seguito", en: "Guided setup · you can edit everything later", fr: "Procédure guidée · tu pourras tout modifier ensuite", de: "Geführte Einrichtung · alles kann später angepasst werden" },
  "wizard.step.name": { it: "Nome", en: "Name", fr: "Nom", de: "Name" },
  "wizard.step.devices": { it: "Dispositivi", en: "Devices", fr: "Appareils", de: "Geräte" },
  "wizard.step.time": { it: "Fasce orarie", en: "Time blocks", fr: "Créneaux", de: "Zeitblöcke" },
  "wizard.step.days": { it: "Ripetizione", en: "Repeat", fr: "Répétition", de: "Wiederholung" },
  "wizard.step.weather": { it: "Meteo", en: "Weather", fr: "Météo", de: "Wetter" },
  "wizard.step.review": { it: "Riepilogo", en: "Review", fr: "Résumé", de: "Zusammenfassung" },
  "wizard.name.heading": { it: "Dai un nome alla schedulazione", en: "Give the schedule a name", fr: "Donne un nom à la planification", de: "Gib dem Zeitplan einen Namen" },
  "wizard.name.hint": { it: "Sarà visibile nella panoramica e nelle notifiche.", en: "It will appear in the overview and in notifications.", fr: "Il apparaîtra dans l'aperçu et les notifications.", de: "Wird in der Übersicht und in Benachrichtigungen angezeigt." },
  "wizard.name.suggestions": { it: "Suggerimenti:", en: "Suggestions:", fr: "Suggestions :", de: "Vorschläge:" },
  "wizard.devices.heading": { it: "Quali dispositivi sono coinvolti?", en: "Which devices are involved?", fr: "Quels appareils sont concernés ?", de: "Welche Geräte sind beteiligt?" },
  "wizard.devices.hint": { it: "Verranno tutti controllati dalla stessa programmazione.", en: "They will all be controlled by the same schedule.", fr: "Ils seront tous contrôlés par la même planification.", de: "Alle werden vom selben Zeitplan gesteuert." },
  "wizard.time.heading": { it: "Imposta le fasce orarie", en: "Set up time blocks", fr: "Définis les créneaux horaires", de: "Zeitblöcke festlegen" },
  "wizard.time.reset_preset": { it: "Reset preset", en: "Reset preset", fr: "Réinitialiser le préréglage", de: "Voreinstellung zurücksetzen" },
  "wizard.time.selected": { it: "Fascia selezionata", en: "Selected block", fr: "Créneau sélectionné", de: "Ausgewählter Block" },
  "wizard.days.heading": { it: "Quali giorni della settimana?", en: "Which days of the week?", fr: "Quels jours de la semaine ?", de: "An welchen Wochentagen?" },
  "wizard.days.hint": { it: "La schedulazione si ripeterà automaticamente ogni settimana.", en: "The schedule will repeat automatically every week.", fr: "La planification se répétera chaque semaine.", de: "Der Zeitplan wiederholt sich jede Woche." },
  "wizard.weather.heading": { it: "Logica meteo", en: "Weather logic", fr: "Logique météo", de: "Wetterlogik" },
  "wizard.weather.hint": { it: "Vuoi che il meteo locale modifichi automaticamente questa programmazione?", en: "Should local weather automatically affect this schedule?", fr: "La météo locale doit-elle modifier automatiquement cette planification ?", de: "Soll das lokale Wetter diesen Zeitplan automatisch anpassen?" },
  "wizard.weather.yes": { it: "Sì, abilita", en: "Yes, enable", fr: "Oui, activer", de: "Ja, aktivieren" },
  "wizard.weather.yes.desc": { it: "Suggeriremo regole utili in base al tipo di dispositivo", en: "We'll suggest useful rules based on the device type", fr: "Des règles utiles seront suggérées selon le type d'appareil", de: "Nützliche Regeln werden je nach Gerätetyp vorgeschlagen" },
  "wizard.weather.no": { it: "No, solo orari", en: "No, time-based only", fr: "Non, juste les horaires", de: "Nein, nur zeitbasiert" },
  "wizard.weather.no.desc": { it: "Esecuzione fissa indipendente dal meteo", en: "Fixed execution regardless of weather", fr: "Exécution fixe indépendante de la météo", de: "Feste Ausführung unabhängig vom Wetter" },
  "wizard.review.heading": { it: "Riepilogo", en: "Review", fr: "Résumé", de: "Zusammenfassung" },
  "wizard.review.devices": { it: "{n} selezionati", en: "{n} selected", fr: "{n} sélectionnés", de: "{n} ausgewählt" },
  "wizard.review.weather_on": { it: "Abilitata", en: "Enabled", fr: "Activée", de: "Aktiviert" },
  "wizard.review.weather_off": { it: "Disabilitata", en: "Disabled", fr: "Désactivée", de: "Deaktiviert" },
  "wizard.review.note": { it: "Potrai modificare ogni dettaglio dall'editor dopo la creazione.", en: "You'll be able to edit every detail after creation.", fr: "Tu pourras modifier chaque détail après la création.", de: "Nach der Erstellung kannst du alle Details bearbeiten." },
  "wizard.create": { it: "Crea schedulazione", en: "Create schedule", fr: "Créer la planification", de: "Zeitplan erstellen" },

  // Devices screen
  "devices.subtitle": { it: "Entità di Home Assistant importate · {n} dispositivi controllati", en: "Imported Home Assistant entities · {n} devices controlled", fr: "Entités Home Assistant importées · {n} appareils contrôlés", de: "Importierte Home-Assistant-Entitäten · {n} gesteuerte Geräte" },
  "devices.add_entity": { it: "Aggiungi entità", en: "Add entity", fr: "Ajouter une entité", de: "Entität hinzufügen" },
  "devices.empty.title": { it: "Nessun dispositivo importato", en: "No devices imported", fr: "Aucun appareil importé", de: "Keine Geräte importiert" },
  "devices.empty.hint": { it: "Aggiungi le tue prime entità HA per iniziare.", en: "Add your first HA entities to get started.", fr: "Ajoute tes premières entités HA pour commencer.", de: "Füge deine ersten HA-Entitäten hinzu, um zu starten." },
  "devices.types_hint": { it: "Tipo e capabilities vengono dedotti automaticamente dal dominio dell'entità HA (es. climate.* → termostato).", en: "Type and capabilities are auto-detected from the HA entity domain (e.g. climate.* → thermostat).", fr: "Le type et les capacités sont déduits automatiquement du domaine de l'entité HA (ex. climate.* → thermostat).", de: "Typ und Fähigkeiten werden automatisch aus der HA-Entitätsdomäne abgeleitet (z. B. climate.* → Thermostat)." },
  "devices.alias": { it: "Alias", en: "Alias", fr: "Alias", de: "Alias" },
  "devices.alias.placeholder": { it: "Alias (opzionale)", en: "Alias (optional)", fr: "Alias (facultatif)", de: "Alias (optional)" },
  "devices.import": { it: "Importa", en: "Import", fr: "Importer", de: "Importieren" },
  "devices.unlink": { it: "Sgancia", en: "Unlink", fr: "Détacher", de: "Trennen" },
  "devices.picker.title": { it: "Aggiungi entità HA", en: "Add HA entity", fr: "Ajouter une entité HA", de: "HA-Entität hinzufügen" },
  "devices.picker.count": { it: "{n} entità disponibili nel tuo Home Assistant", en: "{n} entities available in your Home Assistant", fr: "{n} entités disponibles dans ton Home Assistant", de: "{n} Entitäten in deinem Home Assistant verfügbar" },
  "devices.picker.search": { it: "Cerca per nome o entity_id…", en: "Search by name or entity_id…", fr: "Recherche par nom ou entity_id…", de: "Suche nach Name oder entity_id…" },
  "devices.picker.all_imported": { it: "Tutto importato", en: "All imported", fr: "Tout importé", de: "Alles importiert" },
  "devices.picker.all_imported.hint": { it: "Tutte le entità disponibili sono già state aggiunte.", en: "All available entities have already been added.", fr: "Toutes les entités disponibles ont déjà été ajoutées.", de: "Alle verfügbaren Entitäten wurden bereits hinzugefügt." },

  // Settings
  "settings.subtitle": { it: "Parametri globali dell'integrazione Chronos · validi per tutte le schedulazioni", en: "Global Chronos integration settings · apply to all schedules", fr: "Paramètres globaux de l'intégration Chronos · valables pour toutes les planifications", de: "Globale Chronos-Einstellungen · gelten für alle Zeitpläne" },
  "settings.weather.title": { it: "Sorgente meteo", en: "Weather source", fr: "Source météo", de: "Wetterquelle" },
  "settings.weather.subtitle": { it: "Entità HA usata per valutare le regole meteo · puoi anche puntare attributi specifici a sensori puntuali (stazione meteo locale, Ecowitt, …)", en: "HA entity used to evaluate weather rules · you can also map specific attributes to point sensors (local weather station, Ecowitt, …)", fr: "Entité HA utilisée pour évaluer les règles météo · tu peux aussi mapper des attributs spécifiques à des capteurs ponctuels (station météo locale, Ecowitt, …)", de: "HA-Entität zur Auswertung der Wetterregeln · einzelne Attribute können auch auf Punktsensoren gemappt werden (lokale Wetterstation, Ecowitt, …)" },
  "settings.weather.entity": { it: "Entità meteo principale", en: "Main weather entity", fr: "Entité météo principale", de: "Haupt-Wetterentität" },
  "settings.weather.entity.hint": { it: "Usata per le forecast.* e come fallback se nessun override è impostato qui sotto", en: "Used for forecast.* and as a fallback if no override is set below", fr: "Utilisée pour forecast.* et comme repli si aucun remplacement n'est défini ci-dessous", de: "Wird für forecast.* und als Fallback verwendet, wenn unten keine Überschreibung gesetzt ist" },
  "settings.weather.overrides.title": { it: "Override su sensori puntuali", en: "Point-sensor overrides", fr: "Surcharges par capteurs", de: "Punktsensor-Überschreibung" },
  "settings.weather.overrides.hint": { it: "Per ogni attributo puoi specificare un'entità sensor.* da cui leggere il valore. Se vuoto, viene letto dall'entità weather principale.", en: "For each attribute you can specify a sensor.* entity to read from. If empty, the value is read from the main weather entity.", fr: "Pour chaque attribut, tu peux spécifier une entité sensor.* à lire. Si vide, la valeur est lue depuis l'entité météo principale.", de: "Für jedes Attribut kannst du eine sensor.*-Entität angeben. Leer = Wert wird aus der Haupt-Wetterentität gelesen." },
  "settings.weather.overrides.use_main": { it: "— usa entità weather —", en: "— use weather entity —", fr: "— utiliser l'entité météo —", de: "— Wetterentität verwenden —" },
  "settings.weather.overrides.suggested": { it: "suggeriti", en: "suggested", fr: "suggérés", de: "empfohlen" },
  "settings.weather.overrides.others": { it: "Altri sensori", en: "Other sensors", fr: "Autres capteurs", de: "Weitere Sensoren" },
  "settings.weather.overrides.no_sensors": {
    it: "Nessun sensor.* o binary_sensor.* esposto in questo Home Assistant. Verifica di aver esposto le entità necessarie.",
    en: "No sensor.* or binary_sensor.* entities exposed in this Home Assistant. Make sure the entities you need are exposed.",
    fr: "Aucune entité sensor.* ou binary_sensor.* n'est exposée dans ce Home Assistant. Vérifie que les entités nécessaires sont exposées.",
    de: "Keine sensor.*- oder binary_sensor.*-Entitäten in diesem Home Assistant verfügbar. Stelle sicher, dass die benötigten Entitäten freigegeben sind.",
  },
  "settings.weather.overrides.warn.unit_mismatch": {
    it: "Unità non compatibile: questo attributo si aspetta {expected}, il sensore espone {got}. Le regole potrebbero confrontare valori sbagliati.",
    en: "Unit mismatch: this attribute expects {expected}, the sensor reports {got}. Rules may compare wrong values.",
    fr: "Unités incompatibles : cet attribut attend {expected}, le capteur renvoie {got}. Les règles risquent de comparer des valeurs erronées.",
    de: "Einheit passt nicht: dieses Attribut erwartet {expected}, der Sensor liefert {got}. Regeln vergleichen evtl. falsche Werte.",
  },
  "settings.weather.overrides.warn.class_mismatch": {
    it: "Tipo sensore diverso da quello atteso: atteso {expected}, ricevuto {got}. Verifica che sia la grandezza corretta.",
    en: "Sensor type differs from expected: expected {expected}, got {got}. Make sure it's the right quantity.",
    fr: "Type de capteur différent : attendu {expected}, reçu {got}. Vérifie qu'il s'agit de la bonne grandeur.",
    de: "Sensortyp weicht ab: erwartet {expected}, erhalten {got}. Prüfe, ob es die richtige Größe ist.",
  },
  "settings.weather.overrides.warn.not_numeric": {
    it: "Stato attuale non numerico: \"{state}\". Questo attributo richiede un sensore numerico.",
    en: "Current state is not numeric: \"{state}\". This attribute requires a numeric sensor.",
    fr: "L'état actuel n'est pas numérique : \"{state}\". Cet attribut nécessite un capteur numérique.",
    de: "Aktueller Wert ist nicht numerisch: „{state}\". Dieses Attribut erfordert einen numerischen Sensor.",
  },
  "settings.weather.overrides.warn.numeric_for_condition": {
    it: "L'attributo condition richiede un sensore testuale (es. \"sunny\", \"rainy\"). Questo sensore espone un numero (\"{state}\").",
    en: "The condition attribute needs a text sensor (e.g. \"sunny\", \"rainy\"). This sensor reports a number (\"{state}\").",
    fr: "L'attribut condition attend un capteur texte (ex. \"sunny\", \"rainy\"). Ce capteur renvoie un nombre (\"{state}\").",
    de: "Das Attribut „condition\" erwartet einen Textsensor (z. B. „sunny\", „rainy\"). Dieser Sensor liefert eine Zahl („{state}\").",
  },
  "settings.behavior.title": { it: "Comportamento esecuzione", en: "Execution behavior", fr: "Comportement d'exécution", de: "Ausführungsverhalten" },
  "settings.behavior.subtitle": { it: "Frequenza di aggiornamento e granularità", en: "Update frequency and granularity", fr: "Fréquence de mise à jour et granularité", de: "Aktualisierungsfrequenz und Granularität" },
  "settings.polling": { it: "Polling meteo", en: "Weather polling", fr: "Sondage météo", de: "Wetter-Abfrage" },
  "settings.polling.hint": { it: "Ogni quanto rivalutare le regole", en: "How often rules are re-evaluated", fr: "Fréquence de réévaluation des règles", de: "Intervall zur Neuberechnung der Regeln" },
  "settings.snap": { it: "Snap timeline", en: "Timeline snap", fr: "Pas de la timeline", de: "Timeline-Raster" },
  "settings.snap.hint": { it: "Granularità nel disegnare le fasce", en: "Granularity when drawing blocks", fr: "Granularité lors du tracé des créneaux", de: "Granularität beim Zeichnen der Blöcke" },
  "settings.notify.title": { it: "Notifiche", en: "Notifications", fr: "Notifications", de: "Benachrichtigungen" },
  "settings.notify.subtitle": { it: "Eventi che vogliono una notifica HA", en: "Events that want an HA notification", fr: "Événements qui déclenchent une notification HA", de: "Ereignisse, die eine HA-Benachrichtigung auslösen" },
  "settings.notify.block_executed": { it: "Fascia eseguita", en: "Block executed", fr: "Créneau exécuté", de: "Block ausgeführt" },
  "settings.notify.block_executed.desc": { it: "Quando il sistema avvia un comando per una fascia oraria", en: "When the system fires a command for a time block", fr: "Quand le système déclenche une commande pour un créneau", de: "Wenn das System einen Befehl für einen Zeitblock auslöst" },
  "settings.notify.rule_triggered": { it: "Regola meteo attivata", en: "Weather rule triggered", fr: "Règle météo déclenchée", de: "Wetterregel ausgelöst" },
  "settings.notify.rule_triggered.desc": { it: "Quando una regola override entra in azione", en: "When an override rule kicks in", fr: "Quand une règle de remplacement s'active", de: "Wenn eine Überschreibungsregel greift" },
  "settings.notify.sched_skipped": { it: "Schedulazione saltata", en: "Schedule skipped", fr: "Planification ignorée", de: "Zeitplan übersprungen" },
  "settings.notify.sched_skipped.desc": { it: "Quando una fascia viene skippata per condizioni meteo", en: "When a block is skipped due to weather conditions", fr: "Quand un créneau est ignoré pour cause de météo", de: "Wenn ein Block aufgrund von Wetterbedingungen übersprungen wird" },
  "settings.notify.command_error": { it: "Errore comando", en: "Command error", fr: "Erreur de commande", de: "Befehlsfehler" },
  "settings.notify.command_error.desc": { it: "Se un dispositivo non risponde", en: "If a device fails to respond", fr: "Si un appareil ne répond pas", de: "Wenn ein Gerät nicht antwortet" },
  "settings.appearance.title": { it: "Aspetto", en: "Appearance", fr: "Apparence", de: "Erscheinungsbild" },
  "settings.appearance.subtitle": { it: "Tema e densità predefinita", en: "Theme and default density", fr: "Thème et densité par défaut", de: "Theme und Standarddichte" },
  "settings.theme": { it: "Tema", en: "Theme", fr: "Thème", de: "Theme" },
  "settings.theme.light": { it: "Chiaro", en: "Light", fr: "Clair", de: "Hell" },
  "settings.theme.dark": { it: "Scuro", en: "Dark", fr: "Sombre", de: "Dunkel" },
  "settings.theme.auto": { it: "Auto", en: "Auto", fr: "Auto", de: "Auto" },
  "settings.density": { it: "Densità", en: "Density", fr: "Densité", de: "Dichte" },
  "settings.density.comfortable": { it: "Comoda", en: "Comfortable", fr: "Confortable", de: "Komfortabel" },
  "settings.density.compact": { it: "Compatta", en: "Compact", fr: "Compact", de: "Kompakt" },
  "settings.timeline_default.title": { it: "Timeline predefinita", en: "Default timeline", fr: "Timeline par défaut", de: "Standard-Timeline" },
  "settings.timeline_default.subtitle": { it: "Quale variante mostrare di default nell'editor", en: "Which variant to show by default in the editor", fr: "Quelle variante afficher par défaut dans l'éditeur", de: "Welche Variante im Editor standardmäßig angezeigt wird" },
  "settings.colors.title": { it: "Colori dispositivi", en: "Device colors", fr: "Couleurs des appareils", de: "Gerätefarben" },
  "settings.colors.subtitle": { it: "L'accent del dispositivo riflette il suo stato corrente", en: "The device accent reflects its current state", fr: "L'accent de l'appareil reflète son état actuel", de: "Die Akzentfarbe des Geräts spiegelt seinen aktuellen Zustand wider" },
  "settings.colors.lights.title": { it: "Luci · usa colore reale da Home Assistant", en: "Lights · use real color from Home Assistant", fr: "Lumières · utiliser la couleur réelle de Home Assistant", de: "Lichter · echte Farbe aus Home Assistant verwenden" },
  "settings.colors.lights.desc": { it: "Se attivo, l'icona della luce riflette il colore RGB corrente. Altrimenti usa giallo soft.", en: "When on, the light icon reflects the current RGB color. Otherwise uses soft yellow.", fr: "Si activé, l'icône de la lumière reflète la couleur RGB actuelle. Sinon utilise un jaune doux.", de: "Wenn aktiv, spiegelt das Lichtsymbol die aktuelle RGB-Farbe wider. Sonst weiches Gelb." },
  "settings.colors.thermostat.title": { it: "Termostati · gradiente temperatura", en: "Thermostats · temperature gradient", fr: "Thermostats · dégradé de température", de: "Thermostate · Temperaturverlauf" },
  "settings.colors.thermostat.desc": { it: "Soglia ≤ → colore. La fascia oltre l'ultima soglia usa l'ultimo colore.", en: "Threshold ≤ → color. Values above the last threshold use the last color.", fr: "Seuil ≤ → couleur. Au-delà du dernier seuil, la dernière couleur est utilisée.", de: "Schwelle ≤ → Farbe. Werte über der letzten Schwelle nutzen die letzte Farbe." },
  "settings.colors.boiler.title": { it: "Boiler · gradiente temperatura", en: "Water heater · temperature gradient", fr: "Chauffe-eau · dégradé de température", de: "Boiler · Temperaturverlauf" },
  "settings.colors.boiler.desc": { it: "Stessa logica del termostato, range tipico 30-75°C.", en: "Same logic as the thermostat, typical range 30-75°C.", fr: "Même logique que le thermostat, plage typique 30-75°C.", de: "Gleiche Logik wie Thermostat, typischer Bereich 30-75 °C." },
  "settings.colors.preset.title": { it: "Preset modalità (climate)", en: "Climate preset modes", fr: "Préréglages climate", de: "Climate-Presets" },
  "settings.colors.preset.desc": { it: "Override del colore quando il termostato è in un preset specifico", en: "Color override when the thermostat is in a specific preset", fr: "Surcharge de couleur quand le thermostat est dans un préréglage spécifique", de: "Farb-Überschreibung, wenn das Thermostat in einem bestimmten Preset ist" },
  "settings.colors.add_stop": { it: "Stop", en: "Stop", fr: "Palier", de: "Stopp" },
  "settings.colors.remove_stop": { it: "Rimuovi", en: "Remove", fr: "Retirer", de: "Entfernen" },
  "settings.language.title": { it: "Lingua", en: "Language", fr: "Langue", de: "Sprache" },
  "settings.language.subtitle": { it: "Lingua dell'interfaccia Chronos", en: "Chronos UI language", fr: "Langue de l'interface Chronos", de: "Sprache der Chronos-Oberfläche" },
  "settings.language.auto": { it: "Auto (segui Home Assistant)", en: "Auto (follow Home Assistant)", fr: "Auto (suit Home Assistant)", de: "Auto (Home Assistant folgen)" },

  // Live
  "live.weather.title": { it: "Meteo locale", en: "Local weather", fr: "Météo locale", de: "Lokales Wetter" },
  "live.weather.subtitle": { it: "Sorgente: {entity}", en: "Source: {entity}", fr: "Source : {entity}", de: "Quelle: {entity}" },
  "live.no_weather": { it: "Nessuna sorgente meteo configurata · vai in Impostazioni", en: "No weather source configured · go to Settings", fr: "Aucune source météo configurée · va dans Réglages", de: "Keine Wetterquelle konfiguriert · siehe Einstellungen" },
  "live.forecast.title": { it: "Forecast 24h", en: "24h forecast", fr: "Prévisions 24 h", de: "24-h-Vorhersage" },
  "live.schedules.title": { it: "Schedulazioni · stato live", en: "Schedules · live status", fr: "Planifications · état en direct", de: "Zeitpläne · Live-Status" },
  "live.devices.title": { it: "Dispositivi · stato live", en: "Devices · live status", fr: "Appareils · état en direct", de: "Geräte · Live-Status" },
  "live.devices.subtitle": { it: "Valori in tempo reale", en: "Real-time values", fr: "Valeurs en temps réel", de: "Echtzeitwerte" },
  "live.condition.sunny": { it: "Soleggiato", en: "Sunny", fr: "Ensoleillé", de: "Sonnig" },
  "live.condition.rainy": { it: "Pioggia", en: "Rainy", fr: "Pluvieux", de: "Regnerisch" },
  "live.condition.cloudy": { it: "Nuvoloso", en: "Cloudy", fr: "Nuageux", de: "Bewölkt" },
  "live.condition.partlycloudy": { it: "Parzialmente nuvoloso", en: "Partly cloudy", fr: "Partiellement nuageux", de: "Teilweise bewölkt" },
  "live.condition.snowy": { it: "Neve", en: "Snowy", fr: "Neige", de: "Schnee" },
  "live.condition.fog": { it: "Nebbia", en: "Fog", fr: "Brouillard", de: "Nebel" },
  "live.condition.windy": { it: "Ventoso", en: "Windy", fr: "Venteux", de: "Windig" },

  // Week
  "week.subtitle": { it: "Vista a 7 giorni · {n} schedulazioni attive", en: "7-day view · {n} active schedules", fr: "Vue 7 jours · {n} planifications actives", de: "7-Tage-Ansicht · {n} aktive Zeitpläne" },
  "week.legend": { it: "Legenda", en: "Legend", fr: "Légende", de: "Legende" },
  "week.today": { it: "Oggi", en: "Today", fr: "Aujourd'hui", de: "Heute" },

  // Device detail
  "device.state": { it: "Stato attuale", en: "Current state", fr: "État actuel", de: "Aktueller Zustand" },
  "device.state.live": { it: "aggiornato live", en: "live updates", fr: "mises à jour en direct", de: "Live-Aktualisierung" },
  "device.type": { it: "Tipo dispositivo", en: "Device type", fr: "Type d'appareil", de: "Gerätetyp" },
  "device.linked_schedules": { it: "Schedule collegate", en: "Linked schedules", fr: "Planifications associées", de: "Verknüpfte Zeitpläne" },
  "device.linked_schedules.active": { it: "{n} attive", en: "{n} active", fr: "{n} actives", de: "{n} aktiv" },
  "device.capabilities": { it: "Capabilities rilevate", en: "Detected capabilities", fr: "Capacités détectées", de: "Erkannte Fähigkeiten" },
  "device.capabilities.subtitle": { it: "Servizi HA chiamabili su questo dispositivo", en: "HA services callable on this device", fr: "Services HA disponibles pour cet appareil", de: "Auf diesem Gerät aufrufbare HA-Dienste" },
  "device.schedules_using.title": { it: "Schedulazioni che usano questo dispositivo", en: "Schedules using this device", fr: "Planifications qui utilisent cet appareil", de: "Zeitpläne, die dieses Gerät verwenden" },
  "device.schedules_using.subtitle": { it: "{n} programmazioni collegate", en: "{n} linked schedules", fr: "{n} planifications liées", de: "{n} verknüpfte Zeitpläne" },
  "device.no_schedules": { it: "Nessuna programmazione", en: "No schedules", fr: "Aucune planification", de: "Keine Zeitpläne" },
  "device.no_schedules.hint": { it: "Questo dispositivo non è incluso in nessuno schedule.", en: "This device is not included in any schedule.", fr: "Cet appareil n'est inclus dans aucune planification.", de: "Dieses Gerät ist in keinem Zeitplan enthalten." },
  "device.no_device.title": { it: "Nessun dispositivo", en: "No device", fr: "Aucun appareil", de: "Kein Gerät" },
  "device.no_device.hint": { it: "Importa prima un'entità HA.", en: "Import an HA entity first.", fr: "Importe d'abord une entité HA.", de: "Importiere zuerst eine HA-Entität." },
  "device.open_schedule": { it: "Apri", en: "Open", fr: "Ouvrir", de: "Öffnen" },

  // Weather rule builder
  "wr.heading": { it: "Regola meteo", en: "Weather rule", fr: "Règle météo", de: "Wetterregel" },
  "wr.subtitle": { it: "Costruisci una condizione IF/THEN. Verrà valutata ad ogni transizione di fascia.", en: "Build an IF/THEN condition. It is evaluated on every block transition.", fr: "Construis une condition SI/ALORS. Évaluée à chaque transition de créneau.", de: "Erstelle eine WENN/DANN-Bedingung. Wird bei jedem Blockwechsel ausgewertet." },
  "wr.if.title": { it: "Condizione · quando", en: "Condition · when", fr: "Condition · quand", de: "Bedingung · wann" },
  "wr.if.subtitle": { it: "Cosa deve essere vero per attivare la regola", en: "What must be true for the rule to fire", fr: "Ce qui doit être vrai pour déclencher la règle", de: "Was wahr sein muss, damit die Regel auslöst" },
  "wr.var": { it: "Variabile meteo", en: "Weather variable", fr: "Variable météo", de: "Wettervariable" },
  "wr.op": { it: "Operatore", en: "Operator", fr: "Opérateur", de: "Operator" },
  "wr.threshold": { it: "Soglia", en: "Threshold", fr: "Seuil", de: "Schwelle" },
  "wr.then.title": { it: "Azione · cosa fare", en: "Action · what to do", fr: "Action · que faire", de: "Aktion · was tun" },
  "wr.then.subtitle": { it: "L'effetto sulla fascia oraria attiva", en: "Effect on the active time block", fr: "Effet sur le créneau horaire actif", de: "Auswirkung auf den aktiven Zeitblock" },
  "wr.action.skip": { it: "Salta esecuzione", en: "Skip execution", fr: "Sauter l'exécution", de: "Ausführung überspringen" },
  "wr.action.skip.desc": { it: "La fascia non viene eseguita", en: "The block is not executed", fr: "Le créneau n'est pas exécuté", de: "Der Block wird nicht ausgeführt" },
  "wr.action.shift": { it: "Trasla orario", en: "Shift time", fr: "Décaler l'horaire", de: "Zeit verschieben" },
  "wr.action.shift.desc": { it: "Sposta l'inizio di X ore", en: "Move the start by X hours", fr: "Décale le début de X heures", de: "Verschiebt den Start um X Stunden" },
  "wr.action.force": { it: "Forza azione", en: "Force action", fr: "Forcer une action", de: "Aktion erzwingen" },
  "wr.action.force.desc": { it: "Esegue un'azione specifica", en: "Run a specific action", fr: "Exécute une action spécifique", de: "Führt eine bestimmte Aktion aus" },
  "wr.action.duration": { it: "Cambia durata", en: "Change duration", fr: "Changer la durée", de: "Dauer ändern" },
  "wr.action.duration.desc": { it: "Estende o accorcia la fascia", en: "Extend or shorten the block", fr: "Allonge ou raccourcit le créneau", de: "Verlängert oder kürzt den Block" },
  "wr.preview": { it: "Preview", en: "Preview", fr: "Aperçu", de: "Vorschau" },
  "wr.preview.subtitle": { it: "Come si comporta sulla schedulazione corrente", en: "How it behaves on the current schedule", fr: "Comment elle se comporte sur la planification actuelle", de: "Wie sich die Regel auf den aktuellen Zeitplan auswirkt" },

  // Schedule status
  "schedule.active": { it: "Attiva", en: "Active", fr: "Active", de: "Aktiv" },
  "schedule.disabled": { it: "Disattivata", en: "Disabled", fr: "Désactivée", de: "Deaktiviert" },
  "schedule.next_block": { it: "Prossima fascia", en: "Next block", fr: "Prochain créneau", de: "Nächster Block" },
  "schedule.now_block": { it: "Fascia attuale", en: "Current block", fr: "Créneau actuel", de: "Aktueller Block" },
  "schedule.no_blocks": { it: "Nessuna fascia", en: "No blocks", fr: "Aucun créneau", de: "Keine Blöcke" },
  "schedule.every_day": { it: "Ogni giorno", en: "Every day", fr: "Tous les jours", de: "Jeden Tag" },

  // Days short (mon..sun)
  "days.short.0": { it: "Lun", en: "Mon", fr: "Lun", de: "Mo" },
  "days.short.1": { it: "Mar", en: "Tue", fr: "Mar", de: "Di" },
  "days.short.2": { it: "Mer", en: "Wed", fr: "Mer", de: "Mi" },
  "days.short.3": { it: "Gio", en: "Thu", fr: "Jeu", de: "Do" },
  "days.short.4": { it: "Ven", en: "Fri", fr: "Ven", de: "Fr" },
  "days.short.5": { it: "Sab", en: "Sat", fr: "Sam", de: "Sa" },
  "days.short.6": { it: "Dom", en: "Sun", fr: "Dim", de: "So" },

  // Timeline
  "timeline.linear": { it: "Lineare", en: "Linear", fr: "Linéaire", de: "Linear" },
  "timeline.radial": { it: "Radiale", en: "Radial", fr: "Radial", de: "Radial" },
  "timeline.list": { it: "Lista", en: "List", fr: "Liste", de: "Liste" },

  // Weather attributes (override + rule builder)
  "weather.attr.temperature": { it: "Temperatura attuale", en: "Current temperature", fr: "Température actuelle", de: "Aktuelle Temperatur" },
  "weather.attr.humidity": { it: "Umidità", en: "Humidity", fr: "Humidité", de: "Luftfeuchtigkeit" },
  "weather.attr.wind_speed": { it: "Velocità vento", en: "Wind speed", fr: "Vitesse du vent", de: "Windgeschwindigkeit" },
  "weather.attr.wind_bearing": { it: "Direzione vento", en: "Wind bearing", fr: "Direction du vent", de: "Windrichtung" },
  "weather.attr.pressure": { it: "Pressione atmosferica", en: "Atmospheric pressure", fr: "Pression atmosphérique", de: "Luftdruck" },
  "weather.attr.uv_index": { it: "Indice UV", en: "UV index", fr: "Indice UV", de: "UV-Index" },
  "weather.attr.condition": { it: "Condizione attuale", en: "Current condition", fr: "Condition actuelle", de: "Aktuelle Bedingung" },
  "weather.attr.forecast.temp_max_today": { it: "Temp. max oggi (forecast)", en: "Today max temp (forecast)", fr: "Temp. max aujourd'hui (prévision)", de: "Heute Höchsttemperatur (Vorhersage)" },
  "weather.attr.forecast.temp_min_today": { it: "Temp. min oggi (forecast)", en: "Today min temp (forecast)", fr: "Temp. min aujourd'hui (prévision)", de: "Heute Tiefsttemperatur (Vorhersage)" },
  "weather.attr.forecast.rain_6h": { it: "Pioggia prossime 6h", en: "Rain next 6h", fr: "Pluie 6 prochaines h", de: "Regen nächste 6 h" },
  "weather.attr.forecast.condition_6h": { it: "Condizione +6h", en: "Condition +6h", fr: "Condition +6 h", de: "Bedingung +6 h" },
};

/** Etichetta tradotta per un weather attribute key, con fallback al label backend. */
export function attrLabel(key: string, fallback?: string): string {
  const tk = `weather.attr.${key}`;
  const v = t(tk);
  return v === tk ? (fallback || key) : v;
}
