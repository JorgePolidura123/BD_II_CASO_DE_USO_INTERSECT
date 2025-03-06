const mongoose = require('mongoose');
const { getdata } = require('./api.js');
const uri = 'mongodb://127.0.0.1:27017/actividadContinua1'; //Aqui se especifica el nombre de la base de datos

// Función principal para inicializar la conexión y realizar la inserción
const main = async () => {
  try {
    // Conectar a MongoDB
    await mongoose.connect(uri, {
      autoIndex: false, // No construir índices automáticamente
      maxPoolSize: 10, // Mantener hasta 10 conexiones activas
      serverSelectionTimeoutMS: 5000, // Tiempo de espera antes de fallo en selección de servidor
      socketTimeoutMS: 45000, // Cerrar conexiones inactivas tras 45s
      family: 4 // Usar IPv4
    });
    console.log('✅ Conexión exitosa a MongoDB');

    // Obtener los datos de la API
    let query;
    try {
      query = await getdata();
      console.log('📥 Datos obtenidos:', query);
    } catch (error) {
      console.error('❌ Error obteniendo datos:', error);
      process.exit(1);
    }

    // Definir el esquema de la inserción
    // Definir el esquema de la inserción
    const Schema = new mongoose.Schema({
      edificio: { type: String, required: true }
    });

    // Crear el modelo
    const Model = mongoose.model('actividadContinua1', Schema); //El plural es el nombre de la coleccion

    // Insertar los datos en la base de datos
    try {
      // Verificamos que query.resultado sea un array. "resultado" se define en la api de PHP en la clase ManageDB
      if (query && query.intersect && Array.isArray(query.intersect) && query.intersect.length > 0) {
        // Si union es un array de objetos, insertamos los elementos
        const result = await Model.insertMany(query.intersect);
        console.log('✅ Datos insertados:', result);
      } else {
        console.error('❌ Error: No se encontraron datos válidos en "query. "    ".');
      }
    } catch (e) {
      console.error('❌ Error insertando datos:', e);
    }

    // Cerrar la conexión y salir
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ No se pudo conectar a MongoDB:', error);
    process.exit(1);
  }
};

// Ejecutar la función principal
main();
