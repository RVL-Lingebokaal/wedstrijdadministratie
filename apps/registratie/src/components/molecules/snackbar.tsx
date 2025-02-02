import { Modal, StyleSheet, View } from 'react-native';
import React, { ReactNode } from 'react';

interface SnackbarProps {
  message: ReactNode;
  duration?: number;
  visible: boolean;
  onClose: () => void;
}

export function Snackbar({
  message,
  duration,
  visible,
  onClose,
}: SnackbarProps) {
  setTimeout(() => {
    onClose();
  }, duration || 3000);

  return (
    <Modal visible={visible} transparent>
      <View style={styles.centeredView}>
        <View style={styles.modal}>{message}</View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    top: 'auto',
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
