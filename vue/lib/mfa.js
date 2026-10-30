// Segundo factor con app de autenticación (TOTP). La clave se genera y el código se valida en el servidor:
// estas ayudas solo arman lo que se muestra.

// Dirección otpauth:// que lleva el QR. Se convierte en imagen con el paquete qrcode o la genera el servidor.
// `emisor` es el nombre que muestra la app de autenticación: conviene el de la herramienta («Palo Docs»).
export function uriTotp({ secreto, cuenta, emisor = 'Palo' }) {
  const etiqueta = encodeURIComponent(`${emisor}:${cuenta}`);
  return `otpauth://totp/${etiqueta}?secret=${secreto}&issuer=${encodeURIComponent(emisor)}&digits=6&period=30`;
}

// «JBSWY3DPEHPK3PXP» → «JBSW Y3DP EHPK 3PXP»: en grupos de cuatro se copia a mano sin perderse.
export const agruparSecreto = (secreto) => secreto.replace(/\s/g, '').match(/.{1,4}/g)?.join(' ') ?? '';
