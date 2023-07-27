const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const GET_CONTACTS_URL = 'http://www.raydelto.org/agenda.php';
const CREATE_CONTACT_URL = 'http://www.raydelto.org/agenda.php';

app.get('/', (req, res) => {
  res.redirect('/contactos');
});

app.get('/contactos', async (req, res) => {
  try {
    const response = await axios.get(GET_CONTACTS_URL);
    const contactos = response.data;
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Agenda de Contactos</title>
      </head>
      <body>
        <h2>Agregar Nuevo Contacto</h2>
        <form action="/contactos" method="POST">
          <label for="nombre">Nombre:</label>
          <input type="text" id="nombre" name="nombre" required><br>
          <label for="apellido">Apellido:</label>
          <input type="text" id="apellido" name="apellido" required><br>
          <label for="telefono">Teléfono:</label>
          <input type="text" id="telefono" name="telefono" required><br>
          <button type="submit">Agregar Contacto</button>
        </form>
        <h1>Lista de Contactos</h1>
        <ul>
          ${contactos.map((contacto) => `<li>${contacto.nombre} ${contacto.apellido} - ${contacto.telefono}</li>`).join('')}
        </ul>
      </body>
      </html>
    `);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener la lista de contactos' });
  }
});

app.post('/contactos', async (req, res) => {
  const { nombre, apellido, telefono } = req.body;

  if (!nombre || !apellido || !telefono) {
    return res.status(400).json({ error: 'Nombre, apellido y teléfono son campos requeridos' });
  }

  try {
    const response = await axios.post(CREATE_CONTACT_URL, {
      nombre,
      apellido,
      telefono,
    });
    res.redirect('/contactos');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el contacto' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
