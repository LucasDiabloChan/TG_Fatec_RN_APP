import React, { useEffect, useRef, useState } from "react";
import { View, Pressable, Text, useColorScheme, Image } from "react-native";
import { Controller, useFormContext } from "react-hook-form";
import { CustomMaskedInput, CustomTextInput } from "../CustomInput";
import CustomDropdown from "../CustomDropdown";
import CustomDatePicker from "../CustomDatePicker";
import { UserIcon } from "react-native-heroicons/solid";
import PhotoPicker from "../PhotoPicker";
import { useCepValidation } from "@/schemas/functions/useCepValidation";
import { RegisterUserFormData, RegisterUserPhotoFormData } from "@/schemas/registerUserSchema";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"; 

export default function RegisterFormUser() {
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const { control: controlUser, setValue: setUserValue } = useFormContext<RegisterUserFormData>();
    const { control: controlPhoto, setValue: setPhotoValue } = useFormContext<RegisterUserPhotoFormData>();

    const colorScheme = useColorScheme();
    const rawCPFRef = useRef("");
    const {handleCepChange, endereco, error} = useCepValidation();

    useEffect(() => {
        if(endereco) {
            // Usando os nomes corretos dos campos do schema de endereço
            setUserValue("endereco.logradouro", endereco.logradouro);
            setUserValue("endereco.bairro", endereco.bairro);
            setUserValue("endereco.cidade",endereco.localidade);
            setUserValue("endereco.uf", endereco.estado);
        }

        if (error) console.log('Possível erro no CEP: ' + error)
    }, [endereco])


    const iconsColor = colorScheme == 'dark' ? '#dbeafe':'#0f172a'

    return(
        <KeyboardAwareScrollView
            className="flex-1 w-full sm:w-[50%] lg:w-[50%] mt-4"
            resetScrollToCoords={{ x: 0, y: 0 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerClassName="pb-10 items-center gap-y-3"
        >
            <Controller 
                control={controlPhoto}
                name="arquivo"
                render={({field, fieldState}) => (
                    <View className="items-center w-full mb-4 gap-y-5">
                        <Pressable onPress={() => setModalVisible(true)} className="h-[150px] w-[150px] rounded-full">
                            {field.value?.caminho ? (
                                <Image source={{uri: field.value.caminho}} className="h-full w-full rounded-full"/>
                            ) : (
                                <View className="h-full w-full items-center justify-center bg-slate-200 dark:bg-slate-800 rounded-full">
                                    <UserIcon size={80} color={iconsColor}/>
                                </View>
                            )}
                        </Pressable>
                        {fieldState.error?.message && <Text className="font-nunito-bold text-red-500">{fieldState.error.message}</Text>}
                        <Text className="font-nunito-light text-slate-900 dark:text-blue-100">Selecione uma imagem de no máximo 5mb</Text>

                        <PhotoPicker 
                            visible={modalVisible}
                            onClose={() => setModalVisible(false)}
                            onChange={(asset) => {
                                if (asset) {
                                    field.onChange(asset);
                                }
                                setModalVisible(false);
                            }}
                            value={field.value?.caminho}
                        />
                    </View>
                )}
            />

            <Controller 
                control={controlUser}
                name="nomeCompleto"
                render={({field, fieldState}) => (
                    <CustomTextInput
                        value={field.value}
                        onChangeText={field.onChange}
                        label="Nome completo"
                        placeholder="Digite seu nome completo"
                        required
                        error={fieldState.error?.message}
                    />
                )}
            />

            <Controller 
                control={controlUser}
                name="nomeCompletoSocial"
                render={({field, fieldState}) => (
                    <CustomTextInput 
                        value={field.value}
                        onChangeText={field.onChange}
                        label="Nome social" 
                        placeholder="Digite seu nome social" 
                        required={false}
                        error={fieldState.error?.message} 
                    />
                )}
            />

            <Controller 
                control={controlUser}
                name="cpf"
                render={({field, fieldState}) => (
                    <CustomMaskedInput
                        value={field.value || ''}
                        label="CPF"
                        placeholder="Digite seu CPF"
                        required
                        keyboardType="numeric"
                        onChangeText={(formatted, extracted) => field.onChange(extracted)}
                        mask="999.999.999-99"
                        error={fieldState.error?.message}
                    />
                )}
            />

            <Controller 
                control={controlUser}
                name="dataNascimento"
                render={({field, fieldState}) => (
                    <CustomDatePicker
                        value={field.value}
                        onChange={field.onChange}
                        label="Data de nascimento"
                        required
                        error={fieldState.error?.message}
                    />
                )}
            />

            <Controller 
                control={controlUser}
                name="sexo"
                render={({field, fieldState}) => (
                    <CustomDropdown
                        value={field.value}
                        onChange={field.onChange}
                        label="Selecione seu sexo"
                        required
                        options={['Masculino', 'Feminino', 'Outro']}
                        error={fieldState.error?.message}
                    />
                )}
            />

            <Controller 
                control={controlUser}
                name="endereco.cep"
                render={({field, fieldState}) => (
                    <CustomMaskedInput
                        value={field.value}
                        label="CEP"
                        placeholder="Digite seu CEP"
                        required
                        keyboardType="numeric"
                        onChangeText={(formatted, extracted) => {
                            if (extracted?.length === 8) 
                                handleCepChange(extracted);
                            else if (extracted?.length === 0) {
                                setUserValue("endereco.logradouro" ,'');
                                setUserValue("endereco.bairro" ,'');
                                setUserValue("endereco.cidade" ,'');
                                setUserValue("endereco.uf" ,'');
                            }
                            setUserValue("endereco.cep", extracted);
                        }}
                        mask="99999-999"
                        error={fieldState.error?.message}
                    />
                )}
            />

            <Controller 
                control={controlUser}
                name="endereco.logradouro"
                render={({field, fieldState}) => (
                    <CustomTextInput
                        value={field.value}
                        onChangeText={field.onChange}
                        label="Logradouro"
                        placeholder="Digite o nome de seu logradouro"
                        required
                        error={fieldState.error?.message}
                        disabled
                    />
                )}
            />

            <Controller 
                control={controlUser}
                name="endereco.numero"
                render={({field, fieldState}) => (
                    <CustomTextInput
                        value={field.value}
                        onChangeText={field.onChange}
                        label="Número"
                        placeholder="Digite o número da sua casa"
                        keyboardType="numeric"
                        error={fieldState.error?.message}
                    />
                )}
            />

            <Controller 
                control={controlUser}
                name="endereco.complemento"
                render={({field, fieldState}) => (
                    <CustomTextInput
                        value={field.value}
                        onChangeText={field.onChange}
                        label="Complemento"
                        placeholder="Descreva o complemento"
                        error={fieldState.error?.message}
                    />
                )}
            />

            <Controller 
                control={controlUser}
                name="endereco.bairro"
                render={({field, fieldState}) => (
                    <CustomTextInput
                        value={field.value}
                        onChangeText={field.onChange}
                        label="Bairro"
                        placeholder="Digite o nome do seu bairro"
                        required
                        error={fieldState.error?.message}
                        disabled
                    />
                )}
            />

            <Controller 
                control={controlUser}
                name="endereco.cidade"
                render={({field, fieldState}) => (
                    <CustomTextInput
                        value={field.value}
                        onChangeText={field.onChange}
                        label="Cidade"
                        placeholder="Digite o nome da sua cidade"
                        required
                        error={fieldState.error?.message}
                        disabled
                    />
                )}
            />

            <Controller 
                control={controlUser}
                name="endereco.uf"
                render={({field, fieldState}) => (
                    <CustomTextInput
                        value={field.value}
                        onChangeText={field.onChange}
                        label="Estado"
                        placeholder="Digite o nome do seu estado"
                        required
                        error={fieldState.error?.message}
                        disabled
                    />
                )}
            />

            <Controller 
                control={controlUser}
                name="telefone"
                render={({field, fieldState}) => (
                    <CustomMaskedInput
                        value={field.value || ''}
                        label="Telefone"
                        placeholder="(DDD) 9####-####"
                        required
                        onChangeText={(formatted, extracted) => field.onChange(extracted)}
                        keyboardType="numeric"
                        mask="(99) 99999-9999"
                        error={fieldState.error?.message}
                    />
                )}
            />
        </KeyboardAwareScrollView>
    )
}