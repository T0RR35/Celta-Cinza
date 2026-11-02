package com.celtacinza.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

/**
 * Valida o CPF pelo dígito verificador. Campos nulos ou vazios são considerados
 * válidos aqui; a obrigatoriedade é verificada nas regras de negócio.
 */
public class CpfValidator implements ConstraintValidator<CpfValido, String> {

    @Override
    public boolean isValid(String valor, ConstraintValidatorContext context) {
        if (valor == null || valor.isBlank()) {
            return true;
        }

        String cpf = valor.replaceAll("\\D", "");
        if (cpf.length() != 11 || cpf.chars().distinct().count() == 1) {
            return false;
        }

        return digitoVerificador(cpf, 9) == Character.getNumericValue(cpf.charAt(9))
                && digitoVerificador(cpf, 10) == Character.getNumericValue(cpf.charAt(10));
    }

    private int digitoVerificador(String cpf, int quantidade) {
        int soma = 0;
        for (int i = 0; i < quantidade; i++) {
            soma += Character.getNumericValue(cpf.charAt(i)) * (quantidade + 1 - i);
        }
        int resto = soma % 11;
        return resto < 2 ? 0 : 11 - resto;
    }
}
