function formatDate(date) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const dateString = date.toLocaleDateString('pt-BR', options);
    // Capitalize the first letter of the month
    return dateString.replace(/(\w+ de )(\w+)/, (_, prefix, month) => prefix + month.charAt(0).toUpperCase() + month.slice(1));
}

function setDefaultDate() {
    const today = new Date();
    const formattedDate = formatDate(today);
    document.getElementById('date').value = formattedDate;
    // Set the driver_disabled checkbox to checked
    document.getElementById('driver_disabled').checked = true;
    document.getElementById('licensing_status').value = 'falta_habilitado'; // Set default value here
}

function toFixedWithoutRounding(value, decimals) {
    // Convert value to a string with specified decimal places
    const factor = Math.pow(10, decimals);
    return (Math.floor(value * factor) / factor).toFixed(decimals);
}

function generateText() {
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const br = document.getElementById('br').value;
    const km = document.getElementById('km').value;
    const city = document.getElementById('city').value;
    const numteste = document.getElementById('numteste').value;
    const serialetilometro = document.getElementById('serialetilometro').value;
    const vehicle = document.getElementById('vehicle').value;
    const plate = document.getElementById('plate').value;
    const name = document.getElementById('name').value;
    const cpf = document.getElementById('cpf').value;
    const ethanolInput = document.getElementById('ethanol').value;
    const ethanol = parseFloat(ethanolInput).toFixed(2); // Ensure ethanol always shows 2 decimal places

    let ethanol_considerado;

    if (ethanol < 0.40) {
        ethanol_considerado = toFixedWithoutRounding(parseFloat(ethanol) - 0.032, 2); // Const reduction for low values
    } else if (ethanol >= 0.40 && ethanol < 2.01) {
        ethanol_considerado = toFixedWithoutRounding(parseFloat(ethanol) * 0.92, 2); // 8% reduction for high values
    } else {
        ethanol_considerado = toFixedWithoutRounding(parseFloat(ethanol) * 0.70, 2); // 30% reduction for very high values
    }

    const licensingStatus = document.getElementById('licensing_status').value;
    const anodolicenciamento = document.getElementById('anodolicenciamento').value;
    const driverDisabled = document.getElementById('driver_disabled').checked;
    const motivo = document.getElementById('motivo').value;

    let licensingText;
    switch (licensingStatus) {
        case 'atrasado':
            licensingText = `O veículo envolvido foi recolhido ao pátio contratado da PRF por estar com licenciamento em atraso desde ${anodolicenciamento}.`;
            break;
        case 'regular':
            licensingText = 'O veículo envolvido foi entregue a condutor habilitado e com teste do etilômetro com resultado 0.00 mg/L.';
            break;
        case 'falta_habilitado':
            licensingText = 'O veículo envolvido foi recolhido ao pátio contratado da PRF por falta de condutor habilitado.';
            break;
        default:
            licensingText = 'Falta de condutor habilitado';
    }

    let motivoText;
    switch (motivo) {
        case 'zigzag':
            motivoText = 'O condutor dirigia realizando manobras de zigue-zague na via,';
            break;
        case 'sem_capacete':
            motivoText = 'O condutor conduzia o veículo sem capacete de segurança,';
            break;
        case 'passageiro_sem_capacete':
            motivoText = 'O condutor transportava passageiro sem utilizar capacete de segurança,';
            break;
        default:
            motivoText = 'O motivo da abordagem não foi especificado.';
    }

    const driverStatusText = driverDisabled ? ', inabilitado para conduzir veículos automotores' : '';

    const resultText = 
        `Em ${date}, por volta das ${time}, esta equipe estava realizando fiscalização estática de Alcoolemia no km ${km} da BR ${br}, no município de ${city}, quando foi dada ordem de parada ao veículo ${vehicle}, de placa ${plate}, conduzido por ${name} (CPF: ${cpf})${driverStatusText}. ${motivoText} o que motivou a abordagem. O condutor apresentava sinais de embriaguez como fala embargada, vestes em desordem, olhos vermelhos e odor etílico. A equipe PRF convidou o condutor a realizar o teste do etilômetro. O abordado relatou que havia ingerido bebidas alcoólicas ao longo da noite. O envolvido foi convidado a realizar o exame de alcoolemia, conforme o comprovante nº ${numteste}, impresso pelo aparelho (etilômetro) de marca ALCOLIZER, modelo LE5 e número de série ${serialetilometro}, constatou-se o teor de ${ethanol} miligramas de álcool por litro de ar expelido pelos pulmões, sendo considerado, conforme a Portaria n.º 369/2021/INMETRO, o valor de ${ethanol_considerado} mg/L. Diante das informações obtidas foi constatada ocorrência de conduzir veículo com capacidade psicomotora alterada em razão da influência de álcool - Embriaguez ao volante. Foi dada voz de prisão ao condutor, que foi informado de todos os seus direitos constitucionais, e feito o encaminhamento para a Delegacia de Polícia Civil de ${city} para os procedimentos legais. Não foram utilizadas algemas, devido a colaboração do autor. Por fim, informa-se que o conduzido foi entregue sem nenhuma lesão aparente. ${licensingText}`;

    document.getElementById('result').innerText = resultText;
}

function copyToClipboard() {
    const resultText = document.getElementById('result').innerText;
    navigator.clipboard.writeText(resultText).then(() => {
        alert('Texto copiado para a área de transferência!');
    }).catch(err => {
        alert('Falha ao copiar o texto: ' + err);
    });
}

// Set the default date when the page loads
window.onload = setDefaultDate;
