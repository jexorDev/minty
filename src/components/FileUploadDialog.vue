  <template>
      <v-dialog
              v-model="show"
              transition="dialog-bottom-transition"
              fullscreen
              :loading="loading"
            >
            
        
              <v-card>
                <v-toolbar color="secondary-darken-1" density="compact">
                  <v-toolbar-title>Upload file</v-toolbar-title>
                  <v-toolbar-items>
                    <v-btn
                    icon="mdi-close"                
                    @click="show = false"
                  ></v-btn>
                  </v-toolbar-items>
                </v-toolbar>
                
                <v-card-text>
                   
<v-row>
    <v-col>

        <v-select v-model="selectedImportType" :items="importTypes"></v-select>
    </v-col>
    <v-col>
        <v-file-input
        v-model="selectedFileUpload"
        label="File input"
        ></v-file-input>

    </v-col>
    <v-col>
        <v-btn @click="parseFile">Submit</v-btn>
    </v-col>
</v-row>
<v-row>
<v-col>
     <v-alert v-if="errorMessage" color="error" :text="errorMessage">
                        
                    </v-alert>
                    <v-alert v-if="parsedTransactions.length > 0" color="info" title="Take a look">

                        Does the following look right?
                        <v-btn @click="uploadFile" variant="text">Yes, complete uploading file</v-btn>
                    </v-alert>
    <v-data-table :items="parsedTransactions"></v-data-table>
</v-col>
</v-row>
            
                </v-card-text>

              <v-card-actions>
                <v-btn color="primary" variant="tonal" @click="show = false">Close</v-btn>                
              </v-card-actions>  
              </v-card>
              
            </v-dialog>

  </template>
  <script setup lang="ts">
import FileUploadService from '@/data/services/FileUploadService';
import axios from 'axios';

interface FileTransaction {
    date: Date;
    description: string;
    categoryName: string;
    subCategoryName: string;
    accountName: string;
    merchantName: string;
    amount: number;
    notes: string;
}
const parsedTransactions = ref<FileTransaction[]>([]);

const show = defineModel<boolean>();
const errorMessage = ref("");

const loading = ref(false);
  const selectedFileUpload = ref<File|null>(null);
const importTypes = ['Mint', 'Rocket Money', 'Bank of America'];
  const selectedImportType = ref<string>("Mint");

async function parseFile(): Promise<void> {
    if (selectedFileUpload.value === null) return;
    parsedTransactions.value = [];

    const form = new FormData();
    form.append('csvFile', selectedFileUpload.value);
    
    var importType = importTypes.indexOf(selectedImportType.value);

    try {
        loading.value = true;
         await axios.post(`${import.meta.env.VITE_API_BASE_URL}/files/${importType}/pre`, form, { headers: {"Content-Type": "multipart/form-data"}})
         .then((res) => parsedTransactions.value = res.data)
         .catch((res) => errorMessage.value = res);
        
        

    } finally {
      loading.value = false;

    }
  }

  async function uploadFile(): Promise<void> {
      if (selectedFileUpload.value === null) return;

    const form = new FormData();
    form.append('csvFile', selectedFileUpload.value);
    var importType = importTypes.indexOf(selectedImportType.value);
    
    try {
        loading.value = true;
        const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/files/${importType}`, form, { headers: {"Content-Type": "multipart/form-data"}});
        
        if (res.status === 200) {
            show.value = false;
        } else {
            errorMessage.value = res.statusText;
            
        }

    } finally {
      loading.value = false;

    }
  }
</script>