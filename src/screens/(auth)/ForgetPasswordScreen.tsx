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
import { useTranslation } from 'react-i18next';

import { AuthService } from '../../services/auth.service';
import { AuthStackParamList } from '../../navigation/types';
import Layout from './layout';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgetPassword'>;

export function ForgetPasswordScreen({ navigation }: Props) {
	const { t } = useTranslation();
	const [email, setEmail] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [finished, setFinished] = useState(false);

	const [token, setToken] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [resetError, setResetError] = useState<string | null>(null);
	const [resetLoading, setResetLoading] = useState(false);
	const [resetSuccess, setResetSuccess] = useState(false);

	async function handleSubmit() {
		const trimmedEmail = email.trim();

		if (!trimmedEmail) {
			setError(t('ForgotPassword.emailRequired'));
			return;
		}

		setLoading(true);
		setError(null);

		try {
            console.log('FORGOT PASSWORD REQUEST:', trimmedEmail);
			const response = await AuthService.forgotPassword(trimmedEmail);
            console.log('FORGOT PASSWORD RESPONSE:', response);

			if (!response) {
				setError(t('ForgotPassword.sendError'));
				return;
			}

			setFinished(true);
		} catch (err) {
			console.log('FORGOT PASSWORD ERROR:', err);
			setError(t('ForgotPassword.sendError'));
		} finally {
			setLoading(false);
		}
	}

	async function handleResetPassword() {
		if (!token.trim()) {
			setResetError(t('ForgotPassword.tokenRequired'));
			return;
		}

		if (newPassword.length < 3) {
			setResetError(t('ForgotPassword.passwordTooShort'));
			return;
		}

		if (newPassword !== confirmPassword) {
			setResetError(t('ForgotPassword.passwordMismatch'));
			return;
		}

		setResetLoading(true);
		setResetError(null);

		try {
			await AuthService.resetPassword({ token: token.trim(), newPassword });
			setResetSuccess(true);
		} catch (err) {
			console.log('RESET PASSWORD ERROR:', err);
			setResetError(t('ForgotPassword.resetError'));
		} finally {
			setResetLoading(false);
		}
	}

	function handleSupport() {
		Alert.alert(
			t('ForgotPassword.supportAlertTitle'),
			t('ForgotPassword.supportAlertMessage')
		);
	}

	return (
		<Layout>
			<View style={styles.container}>
				<Text style={styles.title}>
					{resetSuccess ? t('ForgotPassword.resetSuccessTitle') : t('ForgotPassword.title')}
				</Text>
				<Text style={styles.description}>
					{resetSuccess
						? t('ForgotPassword.resetSuccessDescription')
						: finished
						? t('ForgotPassword.codeSentDescription')
						: t('ForgotPassword.description')}
				</Text>

				{!finished && !resetSuccess && (
					<View style={styles.form}>
						<TextInput
							placeholder={t('ForgotPassword.emailPlaceholder')}
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
									<Text style={styles.primaryButtonText}>{t('ForgotPassword.sending')}</Text>
								</View>
							) : (
								<Text style={styles.primaryButtonText}>{t('ForgotPassword.sendInstructions')}</Text>
							)}
						</TouchableOpacity>
					</View>
				)}

				{finished && !resetSuccess && (
					<View style={styles.form}>
						<TextInput
							placeholder={t('ForgotPassword.tokenPlaceholder')}
							value={token}
							autoCapitalize='none'
							autoCorrect={false}
							placeholderTextColor='#8f8f8f'
							onChangeText={setToken}
							style={styles.input}
						/>

						<TextInput
							placeholder={t('ForgotPassword.newPasswordPlaceholder')}
							value={newPassword}
							secureTextEntry
							placeholderTextColor='#8f8f8f'
							onChangeText={setNewPassword}
							style={styles.input}
						/>

						<TextInput
							placeholder={t('ForgotPassword.confirmNewPasswordPlaceholder')}
							value={confirmPassword}
							secureTextEntry
							placeholderTextColor='#8f8f8f'
							onChangeText={setConfirmPassword}
							style={styles.input}
						/>

						{resetError && <Text style={styles.error}>{resetError}</Text>}

						<TouchableOpacity
							activeOpacity={0.85}
							onPress={handleResetPassword}
							disabled={resetLoading}
							style={[styles.primaryButton, resetLoading && styles.buttonDisabled]}
						>
							{resetLoading ? (
								<View style={styles.loadingRow}>
									<ActivityIndicator color="#fff" />
									<Text style={styles.primaryButtonText}>{t('ForgotPassword.resetting')}</Text>
								</View>
							) : (
								<Text style={styles.primaryButtonText}>{t('ForgotPassword.resetPassword')}</Text>
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
						<Text style={styles.secondaryButtonText}>{t('ForgotPassword.backToLogin')}</Text>
					</TouchableOpacity>

					<Pressable onPress={handleSupport} hitSlop={8}>
						<Text style={styles.supportLink}>{t('ForgotPassword.talkToSupport')}</Text>
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
