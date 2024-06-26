<script setup lang="ts">
import { ref, watch } from 'vue';
import BaseLayout from '../components/layouts/BaseLayout.vue';
import useSWRV from 'swrv';
import { historyService } from '../services/HistoryService';

const limit = ref(10);
const page = ref(1);
const bookId = ref('');
const bookName = ref('');
const studentName = ref('');
const studentNIM = ref('');
const dateLoan = ref('');
const dateReturn = ref('');
const loanDuration = ref('');

const {
  data: histories,
  isValidating,
  mutate: reloadHistories,
} = useSWRV(`/histories`, async () => {
  return historyService.getList({
    limit: limit.value,
    page: page.value,
    book_id: bookId.value,
    book_title: bookName.value,
    name_student: studentName.value,
    nim: studentNIM.value,
    date_loan: dateLoan.value,
    date_return: dateReturn.value,
    long_loan_in_days: loanDuration.value ? parseInt(loanDuration.value) : undefined,
  });
});

const handlingSearch = (value: string) => {
  bookName.value = value;
  bookId.value = value;
  studentName.value = value;
  studentNIM.value = value;
};

const handlingDateLoan = (value: string) => {
  dateLoan.value = value;
};

const handlingDateReturn = (value: string) => {
  dateReturn.value = value;
};

const handlingLoanDuration = (value: string) => {
  loanDuration.value = value;
};

watch([limit, page, bookName, studentName, studentNIM, dateLoan, dateReturn, loanDuration], () => {
  reloadHistories();
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
        <div class="tw-grow-1 tw-w-full tw-flex justify-start tw-gap-3">
          <div class="tw-w-1/4">
            <v-text-field
              density="compact"
              placeholder="Search by Book Name, Book ID, Student Name, Student NIM"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              @input="handlingSearch($event.target.value)"
            />
          </div>
          <div class="tw-w-52">
            <v-text-field
              label="Date Loan"
              type="date"
              density="compact"
              placeholder="Date Loan"
              prepend-inner-icon="mdi-calendar"
              variant="outlined"
              @input="handlingDateLoan($event.target.value)"
            />
          </div>
          <div class="tw-w-52">
            <v-text-field
              label="Date Return"
              type="date"
              density="compact"
              placeholder="Date Return"
              prepend-inner-icon="mdi-calendar"
              variant="outlined"
              @input="handlingDateReturn($event.target.value)"
            />
          </div>
          <div class="tw-w-52">
            <v-text-field
              label="Loan Duration"
              type="number"
              density="compact"
              placeholder="Loan Duration"
              prepend-inner-icon="mdi-clock-outline"
              variant="outlined"
              @input="handlingLoanDuration($event.target.value)"
            />
          </div>
        </div>
      </div>

      <!-- Table Section -->
      <v-table fixed-header>
        <thead>
          <tr>
            <th>NO</th>
            <th>NIM</th>
            <th>STUDENT</th>
            <th>BOOK ID</th>
            <th>BOOK NAME</th>
            <th>DATE LOAN</th>
            <th>DATE RETURN</th>
            <th>LOAN DURATION (DAYS)</th>
            <th>CREATED AT</th>
            <th>UPDATED AT</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in histories?.data" :key="item.id">
            <td>{{ index + 1 }}</td>
            <td>{{ item.student.nim }}</td>
            <td>{{ item.student.name }}</td>
            <td>{{ item.book.id }}</td>
            <td>{{ item.book.title }}</td>
            <td>{{ item.transaction.date_loan }}</td>
            <td>{{ item.transaction.date_return }}</td>
            <td>{{ item.duration_loan_days }}</td>
            <td>{{ item.created_at }}</td>
            <td>{{ item.updated_at }}</td>
          </tr>
        </tbody>
      </v-table>
    </div>
  </base-layout>
</template>
