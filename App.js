import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, TextInput } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as FileSystem from 'expo-file-system';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState('Aún no escaneado');
  const [itemName, setItemName] = useState('');
  const [scanDateTime, setScanDateTime] = useState('');

  const askForCameraPermission = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  useEffect(() => {
    askForCameraPermission();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setText(data);
    setItemName(''); // Limpia el nombre del artículo para el próximo escaneo
    setScanDateTime('Fecha y hora: ' + new Date().toLocaleString());

    // Aquí podrías abrir un cuadro de diálogo o una interfaz para que el usuario ingrese el nombre del artículo.
    // Puedes usar un TextInput y un botón para confirmar la entrada del usuario.
    // Guarda el nombre del artículo en el estado itemName.

    console.log('Type: ' + type + '\nDatos: ' + data + '\nNombre del artículo: ' + itemName);
    saveToFile(data, itemName);
  };

  const saveToFile = async (data, itemName) => {
    try {
      const currentDate = new Date();
      const fileName = `barcode_data_${itemName}_${currentDate.toISOString()}.txt`;
      const filePath = `${FileSystem.documentDirectory}${fileName}`;

      await FileSystem.writeAsStringAsync(filePath, data);
      console.log(`Datos guardados en: ${filePath}`);
    } catch (error) {
      console.error('Error al guardar los datos:', error);
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Solicitando permiso de cámara</Text>
      </View>
    );
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={{ margin: 10 }}>Sin acceso a la cámara</Text>
        <Button title={'Permitir acceso a la cámara'} onPress={() => askForCameraPermission()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.barcodebox}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={{ height: 400, width: 600 }}
        />
      </View>
      <Text style={styles.maintext}>{text}</Text>
      <Text style={styles.maintext}>{scanDateTime}</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre del artículo"
        onChangeText={(text) => setItemName(text)}
        value={itemName}
      />
      {scanned && <Button title={'Escanear Nuevo'} onPress={() => setScanned(false)} color='cyan' />}
    </View>
  );
}

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
    backgroundColor: 'cyan',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
    width: 200,
  },
});