import { useState } from 'react';

import {
	ActivityIndicator,
	Alert,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AuthService } from '../../services/auth.service';
import { AuthStackParamList } from '../../navigation/types';
import Layout from './layout';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgetPassword'>;

export function ForgetPasswordScreen({ navigation }: Props) {
	const [email, setEmail] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [finished, setFinished] = useState(false);

	async function handleSubmit() {
		const trimmedEmail = email.trim();

		if (!trimmedEmail) {
			setError('Informe o e-mail para continuar.');
			return;
		}

		setLoading(true);
		setError(null);

		try {
            console.log('FORGOT PASSWORD REQUEST:', trimmedEmail);
			const response = await AuthService.forgotPassword(trimmedEmail);
            console.log('FORGOT PASSWORD RESPONSE:', response);

			if (!response) {
				setError('Não foi possível enviar o e-mail de recuperação.');
				return;
			}

			setFinished(true);
		} catch (err) {
			console.log('FORGOT PASSWORD ERROR:', err);
			setError('Não foi possível enviar o e-mail de recuperação.');
		} finally {
			setLoading(false);
		}
	}

	function handleSupport() {
		Alert.alert(
			'Suporte',
			'Se precisar de ajuda, entre em contato com a equipe de suporte do Eukero.'
		);
	}

	return (
		<Layout>
			<View style={styles.container}>
				<Text style={styles.title}>Esqueceu sua senha?</Text>
				<Text style={styles.description}>
					{finished
						? 'Enviamos as instruções de recuperação para o e-mail informado.'
						: 'Informe o e-mail cadastrado para receber o link de redefinição de senha.'}
				</Text>

				{!finished && (
					<View style={styles.form}>
						<TextInput
							placeholder='E-mail'
							value={email}
							keyboardType='email-address'
							autoCapitalize='none'
							autoCorrect={false}
							placeholderTextColor='#8f8f8f'
							onChangeText={text => setEmail(text)}
							style={styles.input}
						/>

						{error && <Text style={styles.error}>{error}</Text>}

						<TouchableOpacity
							activeOpacity={0.85}
							onPress={handleSubmit}
							disabled={loading}
							style={[styles.primaryButton, loading && styles.buttonDisabled]}
						>
							{loading ? (
								<View style={styles.loadingRow}>
									<ActivityIndicator color="#fff" />
									<Text style={styles.primaryButtonText}>Enviando...</Text>
								</View>
							) : (
								<Text style={styles.primaryButtonText}>Enviar instruções</Text>
							)}
						</TouchableOpacity>
					</View>
				)}

				<View style={styles.actions}>
					<TouchableOpacity
						activeOpacity={0.8}
						onPress={() => navigation.navigate('Login')}
						style={styles.secondaryButton}
					>
						<Text style={styles.secondaryButtonText}>Voltar para o login</Text>
					</TouchableOpacity>

					<Pressable onPress={handleSupport} hitSlop={8}>
						<Text style={styles.supportLink}>Falar com o suporte</Text>
					</Pressable>
				</View>
			</View>
		</Layout>
	);
}

const styles = StyleSheet.create({
	container: {
		gap: 16,
		backgroundColor: '#ffffff',
		paddingVertical: 4,
	},
	title: {
		color: '#121212',
		fontSize: 26,
		fontWeight: '700',
		textAlign: 'center',
	},
	description: {
		color: '#5c5c5c',
		fontSize: 15,
		lineHeight: 22,
		textAlign: 'center',
	},
	form: {
		gap: 12,
	},
	input: {
		borderColor: '#ccc',
		borderRadius: 10,
		borderWidth: 1,
		color: '#121212',
		fontSize: 16,
		paddingHorizontal: 14,
		paddingVertical: 14,
	},
	error: {
		color: '#b42318',
		fontSize: 14,
	},
	primaryButton: {
		alignItems: 'center',
		backgroundColor: '#640000ff',
		borderRadius: 10,
		paddingHorizontal: 16,
		paddingVertical: 14,
	},
	buttonDisabled: {
		opacity: 0.75,
	},
	primaryButtonText: {
		color: '#ffffff',
		fontSize: 16,
		fontWeight: '600',
	},
	loadingRow: {
		alignItems: 'center',
		flexDirection: 'row',
		gap: 10,
	},
	actions: {
		gap: 12,
		paddingTop: 4,
	},
	secondaryButton: {
		alignItems: 'center',
		borderColor: '#640000ff',
		borderRadius: 10,
		borderWidth: 1,
		paddingHorizontal: 16,
		paddingVertical: 14,
	},
	secondaryButtonText: {
		color: '#640000ff',
		fontSize: 16,
		fontWeight: '600',
	},
	supportLink: {
		color: '#640000ff',
		fontSize: 14,
		fontWeight: '600',
		textAlign: 'center',
	},
});
