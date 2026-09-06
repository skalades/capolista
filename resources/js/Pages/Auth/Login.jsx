import { useState } from 'react';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            <div>
                <h2 className="text-[28px] font-oswald font-bold text-ink mb-1">Masuk ke Akun</h2>
                <p className="text-[13.5px] text-ink-soft mb-8">Silakan masukkan email dan password Anda</p>
            </div>

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600 bg-green-50 p-3 rounded-md">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-6">
                <div>
                    <InputLabel htmlFor="email" value="Email" />
                    <div className="mt-2">
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="block w-full"
                            autoComplete="username"
                            isFocused={true}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                    </div>
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div>
                    <div className="flex items-center justify-between">
                        <InputLabel htmlFor="password" value="Password" />
                        {canResetPassword && (
                            <div className="text-sm">
                                <Link
                                    href={route('password.request')}
                                    className="text-[13px] font-semibold text-navy hover:text-navy/70 transition-colors"
                                >
                                    Lupa password?
                                </Link>
                            </div>
                        )}
                    </div>
                    <div className="mt-2 relative">
                        <TextInput
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={data.password}
                            className="block w-full pr-10"
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? (
                                <EyeSlashIcon className="h-5 w-5" aria-hidden="true" />
                            ) : (
                                <EyeIcon className="h-5 w-5" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="flex items-center">
                    <Checkbox
                        name="remember"
                        checked={data.remember}
                        onChange={(e) => setData('remember', e.target.checked)}
                        id="remember-me"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm leading-6 text-gray-900">
                        Ingat saya
                    </label>
                </div>

                <div>
                    <PrimaryButton className="w-full justify-center" disabled={processing}>
                        {processing ? 'Memproses...' : 'Masuk'}
                    </PrimaryButton>
                </div>
            </form>

            <div className="mt-8 text-center border-t border-gray-100 pt-6">
                <p className="text-sm text-gray-500 mb-4">Apakah Anda pelanggan?</p>
                <Link
                    href={route('cek-pesanan')}
                    className="inline-flex items-center justify-center w-full px-4 py-2.5 border border-line text-[13px] font-medium rounded-lg text-ink bg-panel hover:bg-line/20 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-line"
                >
                    Lacak Pesanan Anda
                </Link>
            </div>
        </GuestLayout>
    );
}
