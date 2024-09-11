import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  maxHeight: '80vh',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  overflowY: 'auto',
};

export default function CustomModal({
  open = false,
  handleClose = () => {},
  title = '',
  collections = [],
  selectedShoe = null,
  handleCollectionChange = () => {},
  handleCreateNewCollection = () => {},
}) {
  const [newCollectionName, setNewCollectionName] = React.useState('');

  const handleSave = () => {
    handleCreateNewCollection(newCollectionName);
    setNewCollectionName('');
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {title}
        </Typography>
        <List>
          {collections.map((collection) => (
            <ListItem key={collection.name} disablePadding>
              <Checkbox
                edge="start"
                checked={selectedShoe ? collection.shoes.some((s) => s.styleID === selectedShoe.styleID) : false}
                tabIndex={-1}
                disableRipple
                onChange={(e) => handleCollectionChange(collection.name, e.target.checked)}
              />
              <ListItemText primary={collection.name} />
            </ListItem>
          ))}
        </List>
        <TextField
          fullWidth
          label="New Collection Name"
          value={newCollectionName}
          onChange={(e) => setNewCollectionName(e.target.value)}
          margin="normal"
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
          <Button variant="contained" color="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}