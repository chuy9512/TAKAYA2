<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = strip_tags(trim($_POST["con_name"]));
    $email = filter_var(trim($_POST["con_email"]), FILTER_SANITIZE_EMAIL);
    $message = trim($_POST["con_message"]);

    // Validación simple
    if (empty($name) || empty($message) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo "Por favor completa todos los campos correctamente.";
        exit;
    }

    // Correo destino
    $to = "ventas@takayafurniture.com";
    $subject = "Nuevo mensaje desde el sitio web";
    $body = "Tienes un nuevo mensaje desde el formulario de contacto:\n\n";
    $body .= "Nombre: $name\n";
    $body .= "Correo: $email\n\n";
    $body .= "Mensaje:\n$message\n";

    $headers = "From: $name <$email>";

    if (mail($to, $subject, $body, $headers)) {
        echo "¡Mensaje enviado con éxito!";
    } else {
        echo "Ocurrió un error al enviar el mensaje.";
    }
} else {
    echo "Método no permitido.";
}
?>
