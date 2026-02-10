export default function getDataFormatada(d: number) {
  const data = new Date(d);
  let dd = data.getDate();
  let mm = data.getMonth() + 1;
  let hh = data.getHours();
  let mn = data.getMinutes();
  let dia = dd + "";
  let mes = mm + "";
  let hora = hh + "";
  let min = mn + "";
  if (dd < 10) {
    dia = "0" + dd;
  }
  if (mm < 10) {
    mes = "0" + mm;
  }
  if (hh < 10) {
    hora = "0" + hh;
  }
  if (mn < 10) {
    min = "0" + mn;
  }
  return dia + "/" + mes + "/" + data.getFullYear() + " " + hora + ":" + min;
}
