import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import translations from 'ckeditor5/translations/ko.js';

const CommonEditor = ({ value, onChange}) => {
    return (
        <CKEditor
            editor={ClassicEditor}
            data={value}
            onChange={(event, editor) => onChange(editor.getData())}

            config={{
                licenseKey: "GPL",
                language: 'ko',
                translations: [translations]
            }}
        />
    )
}

export default CommonEditor;