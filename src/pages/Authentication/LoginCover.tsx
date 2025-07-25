import { PropsWithChildren, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setPageTitle, toggleRTL } from '../../slices/themeConfigSlice';
import { AppDispatch, IRootState } from '../../store';
import store from '../../store';
import IconMail from '../../components/Icon/IconMail';
import IconLockDots from '../../components/Icon/IconLockDots';
import IconInstagram from '../../components/Icon/IconInstagram';
import IconFacebookCircle from '../../components/Icon/IconFacebookCircle';
import IconGoogle from '../../components/Icon/IconGoogle';
import { loginUser } from '../../slices/authSlice';
import Toast from '../../services/toast';
import Swal from 'sweetalert2';
import IconEye from '../../components/Icon/IconEye';

const LoginCover = ({ children }: PropsWithChildren) => {
    const isAuthenticatedd = useSelector((state: IRootState) => state.auth.isAuthenticated);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const formRef = useRef<any>(null);
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const [showPassword, setShowPassword] = useState(false);
    
    const toast = Toast();
    useEffect(() => {
        dispatch(setPageTitle('Login Cover'));
        if (isAuthenticatedd) {
            navigate('/'); 
        }
    }, [isAuthenticatedd]);

    const setLocale = (flag: string) => {
        setFlag(flag);
        if (flag.toLowerCase() === 'ae') {
            dispatch(toggleRTL('rtl'));
        } else {
            dispatch(toggleRTL('ltr'));
        }
    };
    const [flag, setFlag] = useState(themeConfig.locale);
    const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!formRef.current) return; 
        const formData = new FormData(formRef.current);
        try {
            const response = await dispatch(loginUser({ formData }) as any);
            if ([200, 201].includes(response.payload.status)) {
                toast.success(response.payload.message);
                if (formRef.current) formRef.current.reset();
                navigate('/'); 
                return
            }else if([401, 400].includes(response.payload.status)){
                toast.error(response.payload.message);
                if (formRef.current) {
                    const emailInput = formRef.current.querySelector('input[name="client_user_email"]') as HTMLInputElement;
                    const passwordInput = formRef.current.querySelector('input[name="password"]') as HTMLInputElement;
                    if (response.payload.message.status === "Incorrect-Password" && passwordInput) {
                        passwordInput.value = "";
                        return
                    }
                    if (response.payload.message.client_user_email === "Incorrect-Email" && emailInput) {
                        emailInput.value = "";
                        return
                    }
                }
                if (formRef.current) formRef.current.reset();
                return
            } else {

                setErrors(response.payload.data);
                if (formRef.current) formRef.current.reset();
            }
        } catch (error: any) {
            Swal.fire('Error:', error.message || error);
        }
    };  

    const HandleSoicalLogin = () => {
        toast.error('Work is in progress for the social icon login.');
    }
    return (
        <div>
            <div className="absolute inset-0">
                <img src="/assets/images/auth/bg-gradient.png" alt="image" className="h-full w-full object-cover" />
            </div>
            <div className="relative flex min-h-screen items-center justify-center bg-[url(/assets/images/auth/map.png)] bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16">
                <img src="/assets/images/auth/coming-soon-object1.png" alt="image" className="absolute left-0 top-1/2 h-full max-h-[893px] -translate-y-1/2" />
                <img src="/assets/images/auth/coming-soon-object2.png" alt="image" className="absolute left-24 top-0 h-40 md:left-[30%]" />
                <img src="/assets/images/auth/coming-soon-object3.png" alt="image" className="absolute right-0 top-0 h-[300px]" />
                <img src="/assets/images/auth/polygon-object.svg" alt="image" className="absolute bottom-0 end-[28%]" />
                <div className="relative flex w-full max-w-[1502px] flex-col justify-between overflow-hidden rounded-md bg-white/60 backdrop-blur-lg dark:bg-black/50 lg:min-h-[758px] lg:flex-row lg:gap-10 xl:gap-0">
                    <div className="relative hidden w-full items-center justify-center bg-[linear-gradient(225deg,#914c39,#d69984)] p-5 lg:inline-flex lg:max-w-[835px] xl:-ms-28 ltr:xl:skew-x-[14deg] rtl:xl:skew-x-[-14deg]">
                        <div className="absolute inset-y-0 w-8 from-primary/10 via-transparent to-transparent ltr:-right-10 ltr:bg-gradient-to-r rtl:-left-10 rtl:bg-gradient-to-l xl:w-16 ltr:xl:-right-20 rtl:xl:-left-20"></div>
                        <div className="ltr:xl:-skew-x-[14deg] rtl:xl:skew-x-[14deg]">
                            <Link to="/" className="w-48 block lg:w-72 ms-10 text-white">
                                Evernest Real Estate
                            </Link>
                            <div className="mt-24 hidden w-full max-w-[430px] lg:block">
                                <img src="/assets/images/auth/login.png" alt="Cover Image" className="w-full" />
                            </div>
                        </div>
                    </div>
                    <div className="relative flex w-full flex-col items-center justify-center gap-6 px-4 pb-16 pt-6 sm:px-6 lg:max-w-[667px]">
                        <div className="flex w-full max-w-[440px] items-center gap-2 lg:absolute lg:end-6 lg:top-6 lg:max-w-full">
                            <Link to="/" className="w-8 block lg:hidden">
                                <img src="/assets/images/logo.svg" alt="Logo" className="mx-auto w-10" />
                            </Link>
                            {/* <div className="dropdown ms-auto w-max">
                                <Dropdown
                                    offset={[0, 8]}
                                    placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                    btnClassName="flex items-center gap-2.5 rounded-lg border border-white-dark/30 bg-white px-2 py-1.5 text-white-dark hover:border-primary hover:text-primary dark:bg-black"
                                    button={
                                        <>
                                            <div>
                                                <img src={`/assets/images/flags/${flag.toUpperCase()}.svg`} alt="image" className="h-5 w-5 rounded-full object-cover" />
                                            </div>
                                            <div className="text-base font-bold uppercase">{flag}</div>
                                            <span className="shrink-0">
                                                <IconCaretDown />
                                            </span>
                                        </>
                                    }
                                    >
                                    <ul className="!px-2 text-dark dark:text-white-dark grid grid-cols-2 gap-2 font-semibold dark:text-white-light/90 w-[280px]">
                                        {themeConfig.languageList.map((item: any) => {
                                            return (
                                                <li key={item.code}>
                                                    <button
                                                        type="button"
                                                        className={`flex w-full hover:text-primary rounded-lg ${flag === item.code ? 'bg-primary/10 text-primary' : ''}`}
                                                        onClick={() => {
                                                            i18next.changeLanguage(item.code);
                                                            // setFlag(item.code);
                                                            setLocale(item.code);
                                                        }}
                                                    >
                                                        <img src={`/assets/images/flags/${item.code.toUpperCase()}.svg`} alt="flag" className="w-5 h-5 object-cover rounded-full" />
                                                        <span className="ltr:ml-3 rtl:mr-3">{item.name}</span>
                                                    </button>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </Dropdown>
                            </div> */}
                        </div>
                        <div className="w-full max-w-[440px] lg:mt-16">
                            <div className="mb-10">
                                <h1 className="text-3xl font-extrabold uppercase !leading-snug text-primary md:text-4xl">Sign in</h1>
                                <p className="text-base font-bold leading-normal text-white-dark">Enter your email and password to login</p>
                            </div>
                            <form encType="multipart/form-data" className="space-y-5 dark:text-white" onSubmit={submitForm} ref={formRef}>
                                <div>
                                    <label htmlFor="Email">Email</label>
                                    <div className="relative text-white-dark">
                                        <input id="Email" type="email" name="client_user_email" placeholder="Enter Email" className="form-input ps-10 placeholder:text-white-dark"
                                        />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconMail fill={true} />
                                        </span>
                                    </div>
                                    {errors?.client_user_email && <p className="text-danger error">{errors.client_user_email[0]}</p>}
                                </div>
                                {/* <div>
                                    <label htmlFor="Password">Password</label>
                                    <div className="relative text-white-dark">
                                        <input id="Password" type="password" name="password" placeholder="Enter Password" className="form-input ps-10 placeholder:text-white-dark"
                                        />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconLockDots fill={true} />
                                        </span>
                                    </div>
                                    {errors?.password && <p className="text-danger error">{errors.password[0]}</p>}
                                </div> */}

                                <div>
                                <label htmlFor="Password">Password</label>
                                <div className="relative text-white-dark">
                                    <input 
                                        id="Password" 
                                        type={showPassword ? "text" : "password"} 
                                        name="password" 
                                        placeholder="Enter Password" 
                                        className="form-input ps-10 placeholder:text-white-dark pr-10" 
                                    />
                                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                        <IconLockDots fill={true} />
                                    </span>
                                    <button 
                                        type="button" 
                                        className="absolute end-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-500 focus:outline-none"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        <div className="relative h-5 w-5">
                                            <IconEye className={`h-5 w-5 transition-opacity ${showPassword ? 'opacity-100' : 'opacity-100'}`} />
                                            {!showPassword && (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="h-px w-5 bg-gray-400 rotate-45 transform origin-center"></div>
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                </div>
                                {errors?.password && <p className="text-danger error">{errors.password[0]}</p>}
                            </div>

                                <button className="btn btn-primary !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">Sign in</button>
                            </form>
                            <div className="relative my-7 text-center md:mb-9">
                                <span className="absolute inset-x-0 top-1/2 h-px w-full -translate-y-1/2 bg-white-light dark:bg-white-dark"></span>
                                <span className="relative bg-white px-2 font-bold uppercase text-white-dark dark:bg-dark dark:text-white-light">or</span>
                            </div>
                            <div className="mb-10 md:mb-[60px]">
                                <ul className="flex justify-center gap-3.5 text-white">
                                    <li>
                                        <Link to="#" onClick={HandleSoicalLogin} className="inline-flex h-8 w-8 items-center justify-center rounded-full p-0 transition hover:scale-110"
                                            style={{ background: 'linear-gradient(135deg, rgb(106 50 25) 0%, rgb(152 97 73) 100%)' }}
                                        >
                                            {' '}
                                            <IconInstagram />
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="#" onClick={HandleSoicalLogin}
                                            className="inline-flex h-8 w-8 items-center justify-center rounded-full p-0 transition hover:scale-110"
                                            style={{ background: 'linear-gradient(135deg, rgb(106 50 25) 0%, rgb(152 97 73) 100%)' }}
                                        >
                                            {' '}
                                            <IconFacebookCircle />{' '}
                                        </Link>
                                    </li>
                                    {/* <li>
                                        <Link
                                            to="#"
                                            className="inline-flex h-8 w-8 items-center justify-center rounded-full p-0 transition hover:scale-110"
                                            style={{ background: 'linear-gradient(135deg, rgb(106 50 25) 0%, rgb(152 97 73) 100%)' }}
                                        >
                                            <IconTwitter fill={true} />
                                        </Link>
                                    </li> */}
                                    <li>
                                        <Link
                                            to="#" onClick={HandleSoicalLogin}
                                            className="inline-flex h-8 w-8 items-center justify-center rounded-full p-0 transition hover:scale-110"
                                            style={{ background: 'linear-gradient(135deg, rgb(106 50 25) 0%, rgb(152 97 73) 100%)' }}
                                        >
                                            <IconGoogle />
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                            {/* <div className="text-center dark:text-white">
                                Don't have an account ?&nbsp;
                                <Link to="/auth/cover-register" className="uppercase text-primary underline transition hover:text-black dark:hover:text-white">
                                    SIGN UP
                                </Link>
                            </div> */}
                        </div>
                        <p className="absolute bottom-6 w-full text-center dark:text-white">© {new Date().getFullYear()}.Evernest Real Estate All Rights Reserved.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginCover;
