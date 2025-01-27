import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { setPageTitle } from '../../slices/themeConfigSlice';
import { useDispatch, useSelector } from 'react-redux';
import IconHome from '../../components/Icon/IconHome';
import IconDollarSignCircle from '../../components/Icon/IconDollarSignCircle';
import IconUser from '../../components/Icon/IconUser';
import IconPhone from '../../components/Icon/IconPhone';
import IconLinkedin from '../../components/Icon/IconLinkedin';
import IconTwitter from '../../components/Icon/IconTwitter';
import IconFacebook from '../../components/Icon/IconFacebook';
import IconGithub from '../../components/Icon/IconGithub';
import apiClient from '../../utils/apiClient';
import { getBaseUrl } from '../../components/BaseUrl';
import Toast from '../../services/toast';

const endpoints = {
    updateApi: `${getBaseUrl()}/users/update_user`,
};


const UserProfile = () => {
    const LoginUser = useSelector((state: any) => state.auth.user || {});
    const combinedRef = useRef<any>({ profile: null });
    const dispatch = useDispatch();
    const toast = Toast();
    useEffect(() => {
        dispatch(setPageTitle('Account Setting'));
    });
    const [tabs, setTabs] = useState<string>('home');
    const toggleTabs = (name: string) => {
        setTabs(name);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (combinedRef.current.profile) {
                const formData = new FormData(combinedRef.current.profile);
                const userId = formData.get('client_user_id');
                const response = await apiClient.post(endpoints.updateApi+'/'+userId, formData);
                if (response.status === 200 || response.status === 201) {
                    toast.success('Profile updated successfully');
                }
            }
        } catch (error: any) {
            if (error.response?.data?.errors) {
            } else if (error.response?.status === 403) {
                window.location.href = '/error';
            } else {
                // showServerError();
            }
        }
    };

    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link to="#" className="text-primary hover:underline"> Users </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Account Settings</span>
                </li>
            </ul>
            <div className="pt-5">
                <div>
                    <ul className="sm:flex font-semibold border-b border-[#ebedf2] dark:border-[#191e3a] mb-5 whitespace-nowrap overflow-y-auto">
                        <li className="inline-block">
                            <button
                                onClick={() => toggleTabs('home')}
                                className={`flex gap-2 p-4 border-b border-transparent hover:border-primary hover:text-primary ${tabs === 'home' ? '!border-primary text-primary' : ''}`}
                            >
                                <IconHome />
                                Home
                            </button>
                        </li>
                        {/* <li className="inline-block">
                            <button
                                onClick={() => toggleTabs('payment-details')}
                                className={`flex gap-2 p-4 border-b border-transparent hover:border-primary hover:text-primary ${tabs === 'payment-details' ? '!border-primary text-primary' : ''}`}
                            >
                                <IconDollarSignCircle />
                                Payment Details
                            </button>
                        </li> */}
                        {/* <li className="inline-block">
                            <button
                                onClick={() => toggleTabs('preferences')}
                                className={`flex gap-2 p-4 border-b border-transparent hover:border-primary hover:text-primary ${tabs === 'preferences' ? '!border-primary text-primary' : ''}`}
                            >
                                <IconUser className="w-5 h-5" />
                                Preferences
                            </button>
                        </li> */}
                        <li className="inline-block">
                            <button
                                onClick={() => toggleTabs('danger-zone')}
                                className={`flex gap-2 p-4 border-b border-transparent hover:border-primary hover:text-primary ${tabs === 'danger-zone' ? '!border-primary text-primary' : ''}`}
                            >
                                <IconPhone />
                                Danger Zone
                            </button>
                        </li>
                    </ul>
                </div>
                
                {tabs === 'home' ? (
                    <div>
                        <form ref={(el) => (combinedRef.current.profile = el)} onSubmit={handleSubmit} className="border border-[#ebedf2] dark:border-[#191e3a] rounded-md p-4 mb-5 bg-white dark:bg-black">
                            <h6 className="text-lg font-bold mb-5">General Information</h6>
                            <div className="flex flex-col sm:flex-row">
                                <div className="ltr:sm:mr-4 rtl:sm:ml-4 w-full sm:w-2/12 mb-5">
                                    <img src="https://oldweb.brur.ac.bd/wp-content/uploads/2019/03/male.jpg" alt="img" className="w-20 h-20 md:w-32 md:h-32 rounded-full object-cover mx-auto" />
                                </div>
                                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label htmlFor="name">Full Name</label>
                                        <input id="name" name='client_user_name' type="text" placeholder="Name" className="form-input" value={LoginUser?.client_user_name} />
                                        <input id="name" name='client_user_id' type="hidden"  className="form-input" value={LoginUser?.client_user_id} />
                                    </div>
                                    <div>
                                        <label htmlFor="profession">Designation</label>
                                        <input id="profession" name='client_user_designation' type="text" placeholder="Web Developer" className="form-input" value={LoginUser?.client_user_designation} />
                                    </div>
                                    <div>
                                        <label htmlFor="profession">Email</label>
                                        <input id="profession" name='client_user_email' type="text" placeholder="Email" className="form-input" value={LoginUser?.client_user_email} />
                                    </div>
                                    <div>
                                        <label htmlFor="profession">Phone</label>
                                        <input id="profession" type="text" name='client_user_phone' placeholder="Phone" className="form-input" value={LoginUser?.client_user_phone} />
                                    </div>
                                    <div className="sm:col-span-2 mt-3">
                                        <button type="submit" className="btn btn-primary"> Save </button> 
                                    </div>
                                </div>
                            </div>
                        </form>

                        {/* <form className="border border-[#ebedf2] dark:border-[#191e3a] rounded-md p-4 bg-white dark:bg-black">
                            <h6 className="text-lg font-bold mb-5">Social</h6>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="flex">
                                    <div className="bg-[#eee] flex justify-center items-center rounded px-3 font-semibold dark:bg-[#1b2e4b] ltr:mr-2 rtl:ml-2">
                                        <IconLinkedin className="w-5 h-5" />
                                    </div>
                                    <input type="text" placeholder="jimmy_turner" className="form-input" />
                                </div>
                                <div className="flex">
                                    <div className="bg-[#eee] flex justify-center items-center rounded px-3 font-semibold dark:bg-[#1b2e4b] ltr:mr-2 rtl:ml-2">
                                        <IconTwitter className="w-5 h-5" />
                                    </div>
                                    <input type="text" placeholder="jimmy_turner" className="form-input" />
                                </div>
                                <div className="flex">
                                    <div className="bg-[#eee] flex justify-center items-center rounded px-3 font-semibold dark:bg-[#1b2e4b] ltr:mr-2 rtl:ml-2">
                                        <IconFacebook className="w-5 h-5" />
                                    </div>
                                    <input type="text" placeholder="jimmy_turner" className="form-input" />
                                </div>
                                <div className="flex">
                                    <div className="bg-[#eee] flex justify-center items-center rounded px-3 font-semibold dark:bg-[#1b2e4b] ltr:mr-2 rtl:ml-2">
                                        <IconGithub />
                                    </div>
                                    <input type="text" placeholder="jimmy_turner" className="form-input" />
                                </div>
                            </div>
                        </form> */}
                    </div>
                ) : (
                    ''
                )}
                {tabs === 'payment-details' ? (
                    <div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
                            <div className="panel">
                                <div className="mb-5">
                                    <h5 className="font-semibold text-lg mb-4">Billing Address</h5>
                                    <p>
                                        Changes to your <span className="text-primary">Billing</span> information will take effect starting with scheduled payment and will be refelected on your next
                                        invoice.
                                    </p>
                                </div>
                                <div className="mb-5">
                                    <div className="border-b border-[#ebedf2] dark:border-[#1b2e4b]">
                                        <div className="flex items-start justify-between py-3">
                                            <h6 className="text-[#515365] font-bold dark:text-white-dark text-[15px]">
                                                Address #1
                                                <span className="block text-white-dark dark:text-white-light font-normal text-xs mt-1">2249 Caynor Circle, New Brunswick, New Jersey</span>
                                            </h6>
                                            <div className="flex items-start justify-between ltr:ml-auto rtl:mr-auto">
                                                <button className="btn btn-dark">Edit</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="border-b border-[#ebedf2] dark:border-[#1b2e4b]">
                                        <div className="flex items-start justify-between py-3">
                                            <h6 className="text-[#515365] font-bold dark:text-white-dark text-[15px]">
                                                Address #2
                                                <span className="block text-white-dark dark:text-white-light font-normal text-xs mt-1">4262 Leverton Cove Road, Springfield, Massachusetts</span>
                                            </h6>
                                            <div className="flex items-start justify-between ltr:ml-auto rtl:mr-auto">
                                                <button className="btn btn-dark">Edit</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-start justify-between py-3">
                                            <h6 className="text-[#515365] font-bold dark:text-white-dark text-[15px]">
                                                Address #3
                                                <span className="block text-white-dark dark:text-white-light font-normal text-xs mt-1">2692 Berkshire Circle, Knoxville, Tennessee</span>
                                            </h6>
                                            <div className="flex items-start justify-between ltr:ml-auto rtl:mr-auto">
                                                <button className="btn btn-dark">Edit</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button className="btn btn-primary">Add Address</button>
                            </div>
                            <div className="panel">
                                <div className="mb-5">
                                    <h5 className="font-semibold text-lg mb-4">Payment History</h5>
                                    <p>
                                        Changes to your <span className="text-primary">Payment Method</span> information will take effect starting with scheduled payment and will be refelected on your
                                        next invoice.
                                    </p>
                                </div>
                                <div className="mb-5">
                                    <div className="border-b border-[#ebedf2] dark:border-[#1b2e4b]">
                                        <div className="flex items-start justify-between py-3">
                                            <div className="flex-none ltr:mr-4 rtl:ml-4">
                                                <img src="/assets/images/card-americanexpress.svg" alt="img" />
                                            </div>
                                            <h6 className="text-[#515365] font-bold dark:text-white-dark text-[15px]">
                                                Mastercard
                                                <span className="block text-white-dark dark:text-white-light font-normal text-xs mt-1">XXXX XXXX XXXX 9704</span>
                                            </h6>
                                            <div className="flex items-start justify-between ltr:ml-auto rtl:mr-auto">
                                                <button className="btn btn-dark">Edit</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="border-b border-[#ebedf2] dark:border-[#1b2e4b]">
                                        <div className="flex items-start justify-between py-3">
                                            <div className="flex-none ltr:mr-4 rtl:ml-4">
                                                <img src="/assets/images/card-mastercard.svg" alt="img" />
                                            </div>
                                            <h6 className="text-[#515365] font-bold dark:text-white-dark text-[15px]">
                                                American Express
                                                <span className="block text-white-dark dark:text-white-light font-normal text-xs mt-1">XXXX XXXX XXXX 310</span>
                                            </h6>
                                            <div className="flex items-start justify-between ltr:ml-auto rtl:mr-auto">
                                                <button className="btn btn-dark">Edit</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-start justify-between py-3">
                                            <div className="flex-none ltr:mr-4 rtl:ml-4">
                                                <img src="/assets/images/card-visa.svg" alt="img" />
                                            </div>
                                            <h6 className="text-[#515365] font-bold dark:text-white-dark text-[15px]">
                                                Visa
                                                <span className="block text-white-dark dark:text-white-light font-normal text-xs mt-1">XXXX XXXX XXXX 5264</span>
                                            </h6>
                                            <div className="flex items-start justify-between ltr:ml-auto rtl:mr-auto">
                                                <button className="btn btn-dark">Edit</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button className="btn btn-primary">Add Payment Method</button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                            <div className="panel">
                                <div className="mb-5">
                                    <h5 className="font-semibold text-lg mb-4">Add Billing Address</h5>
                                    <p>
                                        Changes your New <span className="text-primary">Billing</span> Information.
                                    </p>
                                </div>
                                <div className="mb-5">
                                    <form>
                                        <div className="mb-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="billingName">Name</label>
                                                <input id="billingName" type="text" placeholder="Enter Name" className="form-input" />
                                            </div>
                                            <div>
                                                <label htmlFor="billingEmail">Email</label>
                                                <input id="billingEmail" type="email" placeholder="Enter Email" className="form-input" />
                                            </div>
                                        </div>
                                        <div className="mb-5">
                                            <label htmlFor="billingAddress">Address</label>
                                            <input id="billingAddress" type="text" placeholder="Enter Address" className="form-input" />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-5">
                                            <div className="md:col-span-2">
                                                <label htmlFor="billingCity">City</label>
                                                <input id="billingCity" type="text" placeholder="Enter City" className="form-input" />
                                            </div>
                                            <div>
                                                <label htmlFor="billingState">State</label>
                                                <select id="billingState" className="form-select text-white-dark">
                                                    <option>Choose...</option>
                                                    <option>...</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label htmlFor="billingZip">Zip</label>
                                                <input id="billingZip" type="text" placeholder="Enter Zip" className="form-input" />
                                            </div>
                                        </div>
                                        <button type="button" className="btn btn-primary">
                                            Add
                                        </button>
                                    </form>
                                </div>
                            </div>
                            <div className="panel">
                                <div className="mb-5">
                                    <h5 className="font-semibold text-lg mb-4">Add Payment Method</h5>
                                    <p>
                                        Changes your New <span className="text-primary">Payment Method </span>
                                        Information.
                                    </p>
                                </div>
                                <div className="mb-5">
                                    <form>
                                        <div className="mb-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="payBrand">Card Brand</label>
                                                <select id="payBrand" className="form-select text-white-dark">
                                                    <option value="Mastercard">Mastercard</option>
                                                    <option value="American Express">American Express</option>
                                                    <option value="Visa">Visa</option>
                                                    <option value="Discover">Discover</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label htmlFor="payNumber">Card Number</label>
                                                <input id="payNumber" type="text" placeholder="Card Number" className="form-input" />
                                            </div>
                                        </div>
                                        <div className="mb-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="payHolder">Holder Name</label>
                                                <input id="payHolder" type="text" placeholder="Holder Name" className="form-input" />
                                            </div>
                                            <div>
                                                <label htmlFor="payCvv">CVV/CVV2</label>
                                                <input id="payCvv" type="text" placeholder="CVV" className="form-input" />
                                            </div>
                                        </div>
                                        <div className="mb-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="payExp">Card Expiry</label>
                                                <input id="payExp" type="text" placeholder="Card Expiry" className="form-input" />
                                            </div>
                                        </div>
                                        <button type="button" className="btn btn-primary">
                                            Add
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    ''
                )}
                {tabs === 'preferences' ? (
                    <div className="switch">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
                            <div className="panel space-y-5">
                                <h5 className="font-semibold text-lg mb-4">Choose Theme</h5>
                                <div className="flex justify-around">
                                    <div className="flex">
                                        <label className="inline-flex cursor-pointer">
                                            <input className="form-radio ltr:mr-4 rtl:ml-4 cursor-pointer" type="radio" name="flexRadioDefault" defaultChecked />
                                            <span>
                                                <img className="ms-3" width="100" height="68" alt="settings-dark" src="/assets/images/settings-light.svg" />
                                            </span>
                                        </label>
                                    </div>

                                    <label className="inline-flex cursor-pointer">
                                        <input className="form-radio ltr:mr-4 rtl:ml-4 cursor-pointer" type="radio" name="flexRadioDefault" />
                                        <span>
                                            <img className="ms-3" width="100" height="68" alt="settings-light" src="/assets/images/settings-dark.svg" />
                                        </span>
                                    </label>
                                </div>
                            </div>
                            <div className="panel space-y-5">
                                <h5 className="font-semibold text-lg mb-4">Activity data</h5>
                                <p>Download your Summary, Task and Payment History Data</p>
                                <button type="button" className="btn btn-primary">
                                    Download Data
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div className="panel space-y-5">
                                <h5 className="font-semibold text-lg mb-4">Public Profile</h5>
                                <p>
                                    Your <span className="text-primary">Profile</span> will be visible to anyone on the network.
                                </p>
                                <label className="w-12 h-6 relative">
                                    <input type="checkbox" className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer" id="custom_switch_checkbox1" />
                                    <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                                </label>
                            </div>
                            <div className="panel space-y-5">
                                <h5 className="font-semibold text-lg mb-4">Show my email</h5>
                                <p>
                                    Your <span className="text-primary">Email</span> will be visible to anyone on the network.
                                </p>
                                <label className="w-12 h-6 relative">
                                    <input type="checkbox" className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer" id="custom_switch_checkbox2" />
                                    <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white  dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                                </label>
                            </div>
                            <div className="panel space-y-5">
                                <h5 className="font-semibold text-lg mb-4">Enable keyboard shortcuts</h5>
                                <p>
                                    When enabled, press <span className="text-primary">ctrl</span> for help
                                </p>
                                <label className="w-12 h-6 relative">
                                    <input type="checkbox" className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer" id="custom_switch_checkbox3" />
                                    <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white  dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                                </label>
                            </div>
                            <div className="panel space-y-5">
                                <h5 className="font-semibold text-lg mb-4">Hide left navigation</h5>
                                <p>
                                    Sidebar will be <span className="text-primary">hidden</span> by default
                                </p>
                                <label className="w-12 h-6 relative">
                                    <input type="checkbox" className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer" id="custom_switch_checkbox4" />
                                    <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white  dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                                </label>
                            </div>
                            <div className="panel space-y-5">
                                <h5 className="font-semibold text-lg mb-4">Advertisements</h5>
                                <p>
                                    Display <span className="text-primary">Ads</span> on your dashboard
                                </p>
                                <label className="w-12 h-6 relative">
                                    <input type="checkbox" className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer" id="custom_switch_checkbox5" />
                                    <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white  dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                                </label>
                            </div>
                            <div className="panel space-y-5">
                                <h5 className="font-semibold text-lg mb-4">Social Profile</h5>
                                <p>
                                    Enable your <span className="text-primary">social</span> profiles on this network
                                </p>
                                <label className="w-12 h-6 relative">
                                    <input type="checkbox" className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer" id="custom_switch_checkbox6" />
                                    <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white  dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                ) : (
                    ''
                )}
                {tabs === 'danger-zone' ? (
                    <div className="switch">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            {/* <div className="panel space-y-5">
                                <h5 className="font-semibold text-lg mb-4">Purge Cache</h5>
                                <p>Remove the active resource from the cache without waiting for the predetermined cache expiry time.</p>
                                <button className="btn btn-secondary">Clear</button>
                            </div> */}
                            <div className="panel space-y-5">
                                <h5 className="font-semibold text-lg mb-4">Deactivate Account</h5>
                                <p>The agent is no longer part of the team.</p>
                                <label className="w-12 h-6 relative">
                                    <input type="checkbox" className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer" id="custom_switch_checkbox7" />
                                    <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                                </label>
                            </div>
                            {/* <div className="panel space-y-5">
                                <h5 className="font-semibold text-lg mb-4">Delete Account</h5>
                                <p>Once you delete the account, there is no going back. Please be certain.</p>
                                <button className="btn btn-danger btn-delete-account">Delete my account</button>
                            </div> */}
                        </div>
                    </div>
                ) : (
                    ''
                )}
            </div>
        </div>
    );
};

export default UserProfile;
