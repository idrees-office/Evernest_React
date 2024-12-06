import { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { setPageTitle } from '../../slices/themeConfigSlice';
import ReactQuill from 'react-quill';
import Select from 'react-select';
import { AppDispatch, IRootState } from '../../store';
import { storeDeveloper, editDeveloper } from '../../slices/developerSlice';
import { options } from '../../services/status';
import 'react-quill/dist/quill.snow.css';
import Toast from '../../services/toast';


const Create = () => {
    const { id } = useParams();
    const isEdit = !!id;
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const toast = Toast();
    const formRef = useRef<HTMLFormElement>(null);
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState(null);
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    

    useEffect(() => {
        dispatch(setPageTitle('Developers'));
    })

    useEffect(() => {
        if (isEdit == true) {
            dispatch(editDeveloper(Number(id))).unwrap().then((response) => {

                if (formRef.current) {
                    const form = formRef.current;
                    (form.querySelector('input[name="name"]') as HTMLInputElement).value = response.name || '';
                    form.seo_title.value = response.seo_title || '';
                    form.slug.value = response.slug || '';
                    form.communities.value = response.communities || '';
                    form.seo_description.value = response.seo_description || '';
                    setDescription(response.description || '');
                    setStatus(response.status || '');
                }
            })
            .catch((error: any) => {});
        }else{
            formRef.current?.reset();
            setDescription('');
            setStatus(null);
        }
        dispatch(setPageTitle('Create Blogs'));
    }, [dispatch, isEdit, id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formRef.current){
            const formData = new FormData(formRef.current);
            try {
                const response = await dispatch(storeDeveloper({ formData, id: Number(id) }) as any);
                if (response.payload.status === 'success'){
                    toast.success('Developer Create Successfully');
                    formRef.current?.reset();
                }else{
                    setErrors(response.payload);
                }
            } catch (error: any) {
                console.error('Error creating/updating news:', error);
            }
        }
    };
    return (
        <div>
        <div className="flex flex-col xl:flex-row">
            <div className="panel flex-1 px-2 py-2">
                <div className="flex justify-between items-center">
                    <h5 className="text-lg font-semibold dark:text-white-light">Create Developers</h5>
                    <Link className="btn btn-secondary btn-sm mt-2 cursor-pointer" to="/pages/developers/list">Back</Link> 
                </div>
                <form ref={formRef} onSubmit={handleSubmit} encType="multipart/form-data">
                    <hr className="my-6 border-[#e0e6ed] dark:border-[#1b2e4b]" />
                    <div className="mt-8 px-4">
                        <div className="flex flex-col justify-between lg:flex-row">
                            <div className="mb-6 w-full lg:w-1/2 ltr:lg:mr-6 rtl:lg:ml-6">
                                <div className="mt-4 items-center">
                                    <input autoComplete="off" type="text" name="name" className="form-input flex-1" placeholder="Name"/>
                                    {errors?.name && <p className="text-danger">{errors.name[0]}</p>}
                                </div>
                                <div className="mt-4">
                                    <input autoComplete="off" type="text" className="form-input flex-1" name="seo_title" placeholder="SEO Title" />
                                    {errors?.seo_title && <p className="text-danger">{errors.seo_title[0]}</p>} 
                                </div>
                                <div className="mt-4">
                                    <input autoComplete="off" type="text" className="form-input flex-1" name="communities" placeholder="Communities" />
                                    {errors?.communities && <p className="text-danger">{errors.communities[0]}</p>}
                                </div>
                                <div className="mt-4 items-center">
                                    <input type="file" className="form-input w-full" name="developer_logo"/>
                                </div>
                            </div>
                            <div className="w-full lg:w-1/2">
                                <div className="mt-4">
                                    <input autoComplete="off" type="text" className="form-input flex-1" name="slug" placeholder="Slug"/>
                                    {errors?.slug && <p className="text-danger">{errors.slug[0]}</p>}
                                </div>
                                <div className="mt-4">
                                    <input autoComplete="off" type="text" className="form-input flex-1" name="seo_description" placeholder="SEO Description" />
                                </div>
                                <div className="mt-4">
                                    <Select name="status" className="custom-multiselect flex-1" placeholder="Status" options={options} value={options.find((option) => option.value == status)} onChange={(selectedOption: any) => { setStatus(selectedOption.value); }}/>
                                    {errors?.status && <p className="text-danger">{errors.status[0]}</p>}
                                </div>
                                <div className="mt-4">
                                    <ReactQuill value={description}  onChange={(value) => setDescription(value)} className="w-full" placeholder="Developer Description"/>    
                                    <input type="hidden" name="description" value={description} id="description" />
                                    {errors?.description && <p className="text-danger">{errors.description[0]}</p>}
                                </div>
                                <div className="mt-4">
                                    <button className="btn btn-secondary w-full">Save</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
    );
};

export default Create;
