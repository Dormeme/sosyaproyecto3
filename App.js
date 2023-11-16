import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default function App() {
  // Definición de estados
  const [hasPermission, setHasPermission] = useState(null); // Estado para almacenar el permiso de la cámara
  const [scanned, setScanned] = useState(false); // Estado para rastrear si se ha escaneado un código
  const [text, setText] = useState('Aún no escaneado'); // Estado para mostrar el texto del código escaneado

  // Función para solicitar permiso de la cámara
  const askForCameraPermission = () => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync(); // Solicita el permiso de la cámara
      setHasPermission(status === 'granted'); // Actualiza el estado de permiso
    })();
  }

  // Efecto que se ejecuta al cargar la aplicación para solicitar el permiso de la cámara
  useEffect(() => {
    askForCameraPermission();
  }, []);

  // Función que se ejecuta cuando se escanea un código de barras
  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true); // Marca que se ha escaneado un código
    setText(data); // Actualiza el estado de texto con los datos del código escaneado
    console.log('Type: ' + type + '\nDatos: ' + data); // Muestra información del código en la consola
  };

  // Comprobación de permisos y renderización de la interfaz
  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Solicitando permiso de cámara</Text>
      </View>)
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={{ margin: 10 }}>Sin acceso a la cámara</Text>
        <Button title={'Permitir acceso a la cámara'} onPress={() => askForCameraPermission()} />
      </View>)
  }

  // Renderización de la vista principal
  return (
    <View style={styles.container}>
      <View style={styles.barcodebox}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned} // Maneja la detección de códigos de barras
          style={{ height: 400, width: 600 }} />
      </View>
      <Text style={styles.maintext}>{text}</Text>

      {scanned && <Button title={'Escanear de nuevo?'} onPress={() => setScanned(false)} color='cyan' />}
    </View>
  );
}

// Estilos de la aplicación
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  maintext: {
    fontSize: 16,
    margin: 20,
  },
  barcodebox: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
    width: 300,
    overflow: 'hidden',
    borderRadius: 30,
    backgroundColor: 'cyan'
  }
});