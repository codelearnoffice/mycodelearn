import { spawn } from 'child_process';

export default function startBackendPlugin() {
  let backendProcess: ReturnType<typeof spawn> | undefined;

  return {
    name: 'start-backend',
    configureServer() {
      if (!backendProcess) {
        backendProcess = spawn('npx', ['tsx', 'server/index.ts'], {
          stdio: 'inherit',
          shell: true,
        });
        process.on('exit', () => backendProcess && backendProcess.kill());
      }
    },
  };
}
