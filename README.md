# firestore-json-export-import
Firestore JSON Export-Import | Firestore JSON Exportar-Importar.

Node.js Functions to export data from Firestore to JSON and import data from JSON to Firestore. Taken from [Gist sturmenta/firestore2json.js](https://gist.github.com/sturmenta/cbbe898227cb1eaca7f85d0191eaec7e) and [Copy/Export a Cloud Firestore Database by Bruno Braga](https://blog.cloudboost.io/copy-export-a-cloud-firestore-database-388cde99259b).

Funciones en Node.js para exportar datos de Firestore a JSON e importar datos de JSON a Firestore. Tomado de [Gist sturmenta/firestore2json.js](https://gist.github.com/sturmenta/cbbe898227cb1eaca7f85d0191eaec7e) and [Copy/Export a Cloud Firestore Database de Bruno Braga](https://blog.cloudboost.io/copy-export-a-cloud-firestore-database-388cde99259b).

## Quickstart | Inicio rápido

Set your collections and subcollections names in schema.js:

Establecer los nombres de las colecciones y subcolecciones en schema.js:

```javascript
schema = {
  collection1: {},
  collection2: {
    subcollection1: {}
  }
};
```

Set firebase service account in service-account.json. 

Establecer la cuenta de servicio de firebase en service-account.json. 

[Service account - How to generate new private key](https://firebase.google.com/docs/admin/setup?authuser=0#add_firebase_to_your_app)

[Cuenta de servicio - Cómo generar una nueva llave privada](https://firebase.google.com/docs/admin/setup?authuser=0#add_firebase_to_your_app)

### Exporting - Pull | Exportar

Data is exported to db.json.
Run any of these 2 commands:

Los datos son exportados a db.json. 
Ejecutar cualquiera de estos 2 commandos:

```bash
npm run export
```

```bash
npm run pull
```

### Importing - Push | Importar

Data is imported from db.json.
Run any of these 2 commands:

Los datos son importados de db.json.
Ejecutar cualquiera de estos 2 commandos:

```bash
npm run import
```

```bash
npm run push
```

## Want to help? | ¿Quiere ayudar?

Want to file a bug, contribute some code, or improve documentation? Thanks! Feel free to contact me at [@davidvives](https://twitter.com/davidvives) or at davr59@outlook.com.

¿Quiere reportar un error o una pulga, contribuir con código o mejorar la documentación? ¡Muchas gracias! Puede contactarme a [@davidvives](https://twitter.com/davidvives) o a davr59@outlook.com.
