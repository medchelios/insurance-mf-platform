<template>
  <div class="account-form">
    <h3>Liaison au compte d'épargne et placement</h3>
    
    <div class="form-group">
      <label for="accountType">Type de compte</label>
      <select id="accountType" v-model="form.accountType">
        <option value="">Sélectionner...</option>
        <option value="epargne">Compte épargne</option>
        <option value="placement">Plan de placement</option>
        <option value="assurance-vie">Assurance vie</option>
        <option value="perp">PERP</option>
        <option value="pel">Plan épargne logement</option>
      </select>
    </div>

    <div class="form-group">
      <label for="bankName">Nom de la banque</label>
      <input 
        type="text" 
        id="bankName" 
        v-model="form.bankName"
        placeholder="Ex: BNP Paribas"
      />
    </div>

    <div class="form-group">
      <label for="accountNumber">Numéro de compte</label>
      <input 
        type="text" 
        id="accountNumber" 
        v-model="form.accountNumber"
        placeholder="Ex: FR76 XXXX..."
      />
    </div>

    <div class="form-group">
      <label for="accountHolder">Titulaire du compte</label>
      <input 
        type="text" 
        id="accountHolder" 
        v-model="form.accountHolder"
        placeholder="Nom et prénom"
      />
    </div>

    <div class="form-group">
      <label for="balance">Solde actuel (€)</label>
      <input 
        type="number" 
        id="balance" 
        v-model="form.balance"
        placeholder="0.00"
      />
    </div>

    <div class="form-group">
      <label>
        <input type="checkbox" v-model="form.autoUpdate" />
        Mise à jour automatique du solde
      </label>
    </div>

    <div class="form-group">
      <label for="notes">Notes supplémentaires</label>
      <textarea 
        id="notes" 
        v-model="form.notes"
        rows="3"
        placeholder="Informations complémentaires..."
      ></textarea>
    </div>

    <button 
      type="button" 
      class="submit-btn"
      @click="submitForm"
      :disabled="!isValid">
      Lier le compte
    </button>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue'

const emit = defineEmits(['submit'])

const form = reactive({
  accountType: '',
  bankName: '',
  accountNumber: '',
  accountHolder: '',
  balance: null,
  autoUpdate: false,
  notes: ''
})

const isValid = computed(() => {
  return (
    form.accountType &&
    form.bankName &&
    form.accountNumber &&
    form.accountHolder
  )
})

const submitForm = () => {
  if (isValid.value) {
    emit('submit', { ...form })
    alert('Compte lié avec succès!')
    resetForm()
  }
}

const resetForm = () => {
  form.accountType = ''
  form.bankName = ''
  form.accountNumber = ''
  form.accountHolder = ''
  form.balance = null
  form.autoUpdate = false
  form.notes = ''
}
</script>

<style scoped>
.account-form {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  border: 1px solid #42b883;
  max-width: 500px;
}
.account-form h3 {
  margin: 0 0 20px 0;
  color: #42b883;
}
.form-group {
  margin-bottom: 16px;
}
.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #555;
}
.form-group input[type="text"],
.form-group input[type="number"],
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}
.form-group textarea {
  resize: vertical;
}
.submit-btn {
  background-color: #42b883;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  width: 100%;
}
.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.submit-btn:hover:not(:disabled) {
  background-color: #369b6d;
}
</style>