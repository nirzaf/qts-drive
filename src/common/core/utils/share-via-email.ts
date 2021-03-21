export function shareViaEmail(subject: string, body: string) {
    const url = 'mailto:?subject=' + encodeURIComponent(subject) +  '&body=' + encodeURIComponent(body);
    const a = document.createElement('a');
    a.href = url;
    a.click();
}
