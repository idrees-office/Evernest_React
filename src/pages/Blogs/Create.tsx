import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setPageTitle } from '../../slices/themeConfigSlice';
import  ReactQuill  from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './blogs.css';
import Select from 'react-select';
import { createBlog, editBlog, listBlog } from '../../slices/blogSlice';
import { options } from '../../services/status';
import { AppDispatch, IRootState } from '../../store';
import Toast from '../../services/toast';
import Swal from 'sweetalert2';

const Create = () => {
    const { id } = useParams();
    const isEdit = !!id;
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const toast = Toast();
    const isSuccess = useSelector((state: IRootState) => state.blogs.success);
    const formRef = useRef<HTMLFormElement>(null);
    const [status, setStatus] = useState<any | null>(null);
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [description, setDescription] = useState('');
    const [seodescription, setSeoDescription] = useState('');

    useEffect(() => {
        if (isEdit == true) {
            dispatch(editBlog(Number(id))).unwrap().then((response) => {
                if (formRef.current) {
                    const form = formRef.current;
                    (form.querySelector('input[name="title"]') as HTMLInputElement).value = response.title || '';
                    form.slug.value = response.slug || '';
                    form.seo_title.value = response.seo_title || '';
                    setStatus(response.status || '');
                }
            })
            .catch((error: any) => {});
        }else{
            formRef.current?.reset();
            setStatus(null);
        }
        dispatch(setPageTitle('Create Blogs'));
    }, [dispatch, isEdit, id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formRef.current) return; 
        const formData = new FormData(formRef.current);
        const sanitizedDescription = description === '<p><br></p>' || description.trim() === '' ? '' : description;    // only for long text no need to add other crud
        const sanitizedseoDescription = seodescription === '<p><br></p>' || seodescription.trim() === '' ? '' : seodescription;
        formData.append('description', sanitizedDescription);
        formData.append('seo_description', sanitizedseoDescription);
        try {
            const response = await dispatch(createBlog({ formData, id: Number(id) }) as any);
            if ([200, 201].includes(response.payload.status)) {
                toast.success(response.payload.message);
                formRef.current.reset(); 
            } else {
                setErrors(response.payload);
            }
        } catch (error: any) {
            Swal.fire('Error:', error.message || error);
        }
    };
    return (
        <div>
            <div className="flex flex-col xl:flex-row">
                <div className="panel flex-1 px-2 py-2">
                    <div className="flex justify-between items-center">
                        <h5 className="text-lg font-semibold dark:text-white-light"></h5>
                        <a onClick={() => navigate('/pages/blogs/list')}   className="btn btn-secondary btn-sm mt-2 cursor-pointer"> Back </a>
                    </div>
                    <form encType="multipart/form-data" ref={formRef} onSubmit={handleSubmit}>
                        <hr className="my-6 border-[#e0e6ed] dark:border-[#1b2e4b]" />
                        <div className="mt-8 px-4">
                            <div className="flex flex-col justify-between lg:flex-row">
                                <div className="mb-6 w-full lg:w-1/2 ltr:lg:mr-6 rtl:lg:ml-6">
                                    <div className="mt-4 items-center">
                                        <label htmlFor="titlemark" className="text-white-dark"> Title </label>
                                        <input id="titlemark" autoComplete="off" type="text" className="form-input flex-1" placeholder="Title" name="title" />
                                        {errors?.title && <p className="text-danger error">{errors.title[0]}</p>}
                                    </div>
                                    <div className="mt-4 items-center">
                                        <label htmlFor="description" className="text-white-dark">  Description </label>
                                        <ReactQuill theme="snow" placeholder="Description" value={description} onChange={setDescription} />
                                        {errors?.description && <p className="text-danger error">{errors.description[0]}</p>}
                                    </div>
                                    <div className="mt-4">
                                        <label htmlFor="slugmark" className="text-white-dark"> Slug</label>
                                        <input id="slugmark" autoComplete="off" type="text" className="form-input flex-1" placeholder="Slug" name="slug" />
                                        {errors?.slug && <p className="text-danger error">{errors.slug[0]}</p>}
                                    </div>
                                    <div className="mt-4">
                                        <label htmlFor="seotitle" className="text-white-dark"> Seo Title </label>
                                        <input id="seotitle" autoComplete="off" type="text" className="form-input flex-1" placeholder="Seo Title" name="seo_title" />
                                        {errors?.seo_title && <p className="text-danger error">{errors.seo_title[0]}</p>}
                                    </div>
                                     <div className="mt-4">
                                         <label htmlFor="seotitle" className="text-white-dark"> Seo Description </label>
                                         <ReactQuill theme="snow" placeholder="SEO Description" value={seodescription} onChange={setSeoDescription} />
                                         {errors?.seo_description && <p className="text-danger error">{errors.seo_description[0]}</p>}
                                    </div> 
                                    <div className="mt-4 items-center">
                                        <label htmlFor="ctnFile" className="text-white-dark"> Image </label>
                                        <input id="ctnFile" type="file" className="form-input file:py-2 file:px-4 file:border-0 file:font-semibold p-0 file:bg-secondary/90 ltr:file:mr-5 rtl:file:ml-5 file:text-white file:hover:bg-primary" name="blogs_image" />
                                    </div>
                                    <div className="mt-4">
                                        <label htmlFor="ctnstatus" className="text-white-dark"> Status </label>
                                        <Select placeholder="Select an option" name="status" options={options} value={options.find((option) => option.value == status)} onChange={(selectedOption: any) => { setStatus(selectedOption.value); }}
                                        />
                                        {errors?.status && <p className="text-danger error">{errors.status[0]}</p>}
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




