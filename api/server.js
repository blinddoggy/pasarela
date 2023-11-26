const express = require('express');
const mercadopago = require('mercadopago');

mercadopago.configure({
  access_token: 'TU_ACCESS_TOKEN_DE_MERCADO_PAGO',
});

const app = express();
app.use(express.json());

app.post('/pagar', async (req, res) => {
  try {
    const { monto, descripcion, token } = req.body;

    const preference = {
      items: [
        {
          title: descripcion,
          unit_price: parseFloat(monto),
          quantity: 1,
        },
      ],
      payer: {
        email: 'correo@ejemplo.com', // Reemplaza con el correo del comprador
      },
      payment_methods: {
        excluded_payment_types: [{id: 'atm'}],
      },
      external_reference: 'TU_REFERENCIA_EXTERNA', // Puede ser tu ID de producto o cualquier referencia única
      back_urls: {
        success: 'http://tu-sitio.com/exito',
        pending: 'http://tu-sitio.com/pendiente',
        failure: 'http://tu-sitio.com/fallo',
      },
    };

    const respuesta = await mercadopago.preferences.create(preference);

    res.json({ id: respuesta.body.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el pago' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en funcionamiento en el puerto ${PORT}`));
