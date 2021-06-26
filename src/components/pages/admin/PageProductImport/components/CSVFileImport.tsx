import React, {ChangeEvent, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography";
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  content: {
    padding: theme.spacing(3, 0, 3),
  },
}));

type CSVFileImportProps = {
  url: string,
  title: string
};

export default function CSVFileImport({url, title}: CSVFileImportProps) {
  const classes = useStyles();
  const [file, setFile] = useState<File | null>();

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e);
    const files = e.target.files

    if (!files?.length) return

    const file = files.item(0);

    if (!['text/csv', 'application/vnd.ms-excel'].includes(file!.type)) return

    setFile(file);
  };

  const removeFile = () => {
    setFile(null);
  };

  const uploadFile = async (e: any) => {
    if (!file) {
      return;
    }

    try {
      const token = localStorage.getItem('authorization_token');
      const headers: any = {};

      if (token) {
        headers.Authorization = `Basic ${token}`
      }

      // Get the presigned URL
      const response = await axios({
        method: 'GET',
        url,
        params: {
          name: encodeURIComponent(file.name)
        },
        headers
      });

      console.log('File to upload: ', file.name)
      console.log('Uploading to: ', response.data)

      const result = await fetch(response.data, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': 'text/csv'
        }
      })
      console.log('Result: ', result)
      setFile(null);
    } catch (e) {
      console.error(e)
    }
  };

  return (
    <div className={classes.content}>
      <Typography color="textSecondary" variant="h6" gutterBottom>
        {title}
      </Typography>
      {!file ? (
        <input type="file" accept="text/csv" onChange={onFileChange}/>
      ) : (
        <div>
          <button onClick={removeFile}>Remove file</button>
          <button onClick={uploadFile}>Upload file</button>
        </div>
      )}
    </div>
  );
}
