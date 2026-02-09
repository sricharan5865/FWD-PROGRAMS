
/**
 * Handles the download of a file from a base64 string.
 * 
 * @param fileBlobData - The base64 encoded file data (e.g., "data:application/pdf;base64,...").
 * @param fileType - The type of the file (e.g., "PDF", "DOC").
 * @param fileName - The desired name for the downloaded file.
 */
export const downloadFile = (fileBlobData: string, fileType: string, fileName: string): boolean => {
    try {
        if (!fileBlobData || !fileBlobData.includes(',')) {
            console.error("System Error: Corrupted or missing file data.");
            return false;
        }

        const base64Parts = fileBlobData.split(',');
        const contentType = base64Parts[0].split(':')[1].split(';')[0];
        const byteCharacters = atob(base64Parts[1]);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += 512) {
            const slice = byteCharacters.slice(offset, offset + 512);
            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        const blob = new Blob(byteArrays, { type: contentType });
        const blobUrl = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = blobUrl;

        const typeExtensions: Record<string, string> = {
            'PDF': 'pdf',
            'DOC': 'docx',
            'PPT': 'pptx',
            'ZIP': 'zip',
            'IMG': 'png'
        };
        const extension = typeExtensions[fileType] || 'txt';
        const safeTitle = fileName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        link.setAttribute('download', `${safeTitle}.${extension}`);

        document.body.appendChild(link);
        link.click();

        setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
        }, 2000);

        return true;
    } catch (err) {
        console.error("Download Error:", err);
        return false;
    }
};
