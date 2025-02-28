export class ScriptLoaderUtil {
  static loadScript(scriptUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // Verifica se o script já foi carregado
      if (document.querySelector(`script[src="${scriptUrl}"]`)) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = scriptUrl;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Falha ao carregar o script: ${scriptUrl}`));

      document.body.appendChild(script);
    });
  }
}
