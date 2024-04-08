<script setup lang="ts">
import { ref, watch } from 'vue';
import BaseLayout from '../components/layouts/BaseLayout.vue';
import useSWRV from 'swrv';
import { transactionService } from '../services/TransactionService';
import { getErrorMessageAxios } from '../utils/function';

const limit = ref(10);
const page = ref(1);
const qStudentName = ref('');
const isModalReturnVisible = ref<boolean>(false);
const selectedTransactionId = ref<number | null>(null);

const {
  data: transactions,
  isValidating,
  mutate: reloadTransactions,
} = useSWRV(`/transactions`, async () => {
  return transactionService.getAllTransactions({
    limit: limit.value,
    page: page.value,
    student_name: qStudentName.value,
  });
});

const onReturnBook = async () => {
  try {
    await transactionService.returnBook(selectedTransactionId.value);
    alert('Return transaction success');
    handleCloseModalReturn();
    reloadTransactions();
  } catch (error) {
    const message = getErrorMessageAxios(error);

    alert(message);
  }
};

const handlingSearch = (value: string) => {
  qStudentName.value = value;
};

const handleOpenModalReturn = (id: number) => {
  isModalReturnVisible.value = true;
  selectedTransactionId.value = id;
};

const handleCloseModalReturn = () => {
  isModalReturnVisible.value = false;
  selectedTransactionId.value = null;
};

// Refetch data when limit, page, or qTitle changes
watch([limit, page, qStudentName], () => {
  reloadTransactions();
});
</script>

<template>
  <base-layout>
    <v-overlay :model-value="isValidating" class="align-center justify-center">
      <v-progress-circular color="primary" size="64" indeterminate></v-progress-circular>
    </v-overlay>
    <div class="tw-flex tw-flex-col tw-gap-5">
      <!-- Header Section -->
      <div class="tw-flex tw-items-center tw-gap-5">
        <div class="tw-grow-1 tw-w-full tw-flex justify-start">
          <div class="tw-w-1/2">
            <v-text-field
              density="compact"
              placeholder="Search"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              @input="handlingSearch($event.target.value)"
            />
          </div>
        </div>
        <div class="tw-grow-1 tw-w-full tw-flex justify-end">
          <v-btn
            color="green"
            :to="{
              name: 'transaction-form',
              params: {
                id: 'new',
              },
            }"
          >
            Add
          </v-btn>
        </div>
      </div>

      <!-- Table Section -->
      <v-table fixed-header>
        <thead>
          <tr>
            <th>NO</th>
            <th>STUDENT</th>
            <th>DATE LOAN</th>
            <th>DATE RETURN</th>
            <th style="width: 100px">TRX</th>
            <th>CREATED AT</th>
            <th>UPDATED AT</th>
            <th>KONTROL</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in transactions?.data" :key="item.id">
            <td>{{ index + 1 }}</td>
            <td>{{ item.student.name }}</td>
            <td>{{ item.date_loan }}</td>
            <td>{{ item.date_return }}</td>
            <td>{{ `${item.TransactionDetail.length} TRX` }}</td>
            <td>{{ item.created_at }}</td>
            <td>{{ item.updated_at }}</td>
            <td class="tw-flex tw-gap-2 tw-items-center" style="justify-content: center">
              <div v-if="item.status == 'loaned'">
                <v-btn
                  density="comfortable"
                  color="purple"
                  prepend-icon="mdi-keyboard-return"
                  small
                  @click="handleOpenModalReturn(item.id)"
                >
                  Return
                </v-btn>
              </div>

              <div v-else>
                <v-badge color="info" content="Already Return" class="ma-5" inline></v-badge>
              </div>
            </td>
          </tr>
        </tbody>
      </v-table>

      <v-dialog v-model="isModalReturnVisible" width="auto" persistent>
        <v-card width="400" prepend-icon="mdi-alert">
          <v-card-title>Confirmation</v-card-title>
          <v-card-text>
            <p>
              After you click the return button, the transaction will be marked as returned and the book will be
              recorded to history transaction.
            </p>
            <br />
            <p>Are you sure want to return this transaction?</p>
          </v-card-text>
          <v-card-actions class="tw-flex tw-justify-end">
            <v-btn color="grey" @click="handleCloseModalReturn"> Cancel </v-btn>
            <v-btn color="green" @click="onReturnBook"> Return </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </base-layout>
</template>
