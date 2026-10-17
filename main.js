const cuerpo = document.querySelector("body");

const titulo = document.createElement("h1");
titulo.textContent = "Publicaciones";
cuerpo.appendChild(titulo);

const mensaje = document.createElement("p");
mensaje.textContent = "Cargando publicaciones...";
cuerpo.appendChild(mensaje);

const lista = document.createElement("ul");
cuerpo.appendChild(lista);

function cargarToastify() {
  return new Promise(function (resolver, rechazar) {
    const estilo = document.createElement("link");
    estilo.rel = "stylesheet";
    estilo.href =
      "https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css";
    document.head.appendChild(estilo);

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/toastify-js";
    script.onload = resolver;
    script.onerror = function () {
      rechazar(new Error("No se pudo cargar la librería Toastify."));
    };

    document.head.appendChild(script);
  });
}

async function cargarPublicaciones() {
  let toastifyDisponible = false;

  try {
    await cargarToastify();
    toastifyDisponible = true;
  } catch (error) {
    console.error(error);
  }

  try {
    const respuesta = await fetch(
      "https://jsonplaceholder.typicode.com/posts?_limit=10"
    );

    if (!respuesta.ok) {
      throw new Error("Ocurrió un error al pedir las publicaciones.");
    }

    const publicaciones = await respuesta.json();

    publicaciones.forEach(function (publicacion) {
      const elemento = document.createElement("li");
      const tituloPublicacion = document.createElement("h2");
      const textoPublicacion = document.createElement("p");

      tituloPublicacion.textContent = publicacion.title;
      textoPublicacion.textContent = publicacion.body;

      elemento.appendChild(tituloPublicacion);
      elemento.appendChild(textoPublicacion);
      lista.appendChild(elemento);
    });

    mensaje.textContent = "Las publicaciones se cargaron correctamente.";

    if (toastifyDisponible) {
      Toastify({
        text: "Publicaciones cargadas correctamente",
        duration: 3000,
        gravity: "top",
        position: "right",
        style: {
          background: "#198754",
        },
      }).showToast();
    }
  } catch (error) {
    mensaje.textContent =
      "No se pudieron cargar las publicaciones. Intentá de nuevo más tarde.";
    console.error(error);

    if (toastifyDisponible) {
      Toastify({
        text: "Ocurrió un error al cargar las publicaciones",
        duration: 4000,
        gravity: "top",
        position: "right",
        style: {
          background: "#dc3545",
        },
      }).showToast();
    }
  }
}

cargarPublicaciones();