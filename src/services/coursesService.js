/**
 * Servicio para gestionar cursos y productos digitales
 * Integra con Supabase para administrar cursos, lecciones y progreso del usuario
 */
import { supabase } from './supabaseService';
import { dataService } from './supabaseService';

// Tablas en Supabase
const TABLES = {
  COURSES: 'courses',
  LESSONS: 'lessons',
  SECTIONS: 'course_sections',
  USER_COURSES: 'user_courses',
  USER_PROGRESS: 'user_progress',
  PURCHASES: 'purchases'
};

// Servicio para gestión de cursos
const coursesService = {
  // Obtener todos los cursos disponibles
  async getAllCourses() {
    try {
      const { data, error } = await dataService.getAll(TABLES.COURSES, {
        orderBy: { column: 'created_at', ascending: false }
      });
      
      if (error) throw error;
      return { courses: data, error: null };
    } catch (error) {
      console.error('Error al obtener cursos:', error);
      return { courses: null, error };
    }
  },
  
  // Obtener un curso específico con sus secciones y lecciones
  async getCourseDetails(courseId) {
    try {
      // Obtener datos del curso
      const { data: course, error: courseError } = await dataService.getById(TABLES.COURSES, courseId);
      if (courseError) throw courseError;
      
      // Obtener secciones del curso
      const { data: sections, error: sectionsError } = await supabase
        .from(TABLES.SECTIONS)
        .select('*')
        .eq('course_id', courseId)
        .order('order', { ascending: true });
      if (sectionsError) throw sectionsError;
      
      // Obtener lecciones para cada sección
      const sectionsWithLessons = await Promise.all(
        sections.map(async (section) => {
          const { data: lessons, error: lessonsError } = await supabase
            .from(TABLES.LESSONS)
            .select('*')
            .eq('section_id', section.id)
            .order('order', { ascending: true });
          
          if (lessonsError) throw lessonsError;
          
          return {
            ...section,
            lessons: lessons || []
          };
        })
      );
      
      return { 
        course: { 
          ...course, 
          sections: sectionsWithLessons 
        }, 
        error: null 
      };
    } catch (error) {
      console.error(`Error al obtener detalles del curso ${courseId}:`, error);
      return { course: null, error };
    }
  },
  
  // Obtener cursos comprados por el usuario
  async getUserCourses(userId) {
    try {
      const { data: userCourses, error: userCoursesError } = await supabase
        .from(TABLES.USER_COURSES)
        .select(`
          *,
          course:${TABLES.COURSES}(*)
        `)
        .eq('user_id', userId);
      
      if (userCoursesError) throw userCoursesError;
      
      // Obtener progreso para cada curso
      const coursesWithProgress = await Promise.all(
        userCourses.map(async (userCourse) => {
          const { data: progress, error: progressError } = await supabase
            .from(TABLES.USER_PROGRESS)
            .select('*')
            .eq('user_id', userId)
            .eq('course_id', userCourse.course_id);
          
          if (progressError) throw progressError;
          
          // Calcular porcentaje de progreso
          const totalLessons = await this.getCourseLessonsCount(userCourse.course_id);
          const completedLessons = progress ? progress.length : 0;
          const progressPercentage = totalLessons > 0 
            ? Math.round((completedLessons / totalLessons) * 100) 
            : 0;
          
          return {
            ...userCourse,
            progress: progressPercentage,
            completed_lessons: completedLessons,
            total_lessons: totalLessons
          };
        })
      );
      
      return { courses: coursesWithProgress, error: null };
    } catch (error) {
      console.error(`Error al obtener cursos del usuario ${userId}:`, error);
      return { courses: [], error };
    }
  },
  
  // Obtener número total de lecciones en un curso
  async getCourseLessonsCount(courseId) {
    try {
      const { data, error } = await supabase
        .from(TABLES.LESSONS)
        .select('id, section_id')
        .eq('course_id', courseId);
      
      if (error) throw error;
      return data.length;
    } catch (error) {
      console.error(`Error al contar lecciones del curso ${courseId}:`, error);
      return 0;
    }
  },
  
  // Marcar una lección como completada
  async markLessonAsCompleted(userId, courseId, lessonId) {
    try {
      // Verificar si ya existe el registro
      const { data: existing, error: checkError } = await supabase
        .from(TABLES.USER_PROGRESS)
        .select('*')
        .eq('user_id', userId)
        .eq('lesson_id', lessonId)
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no se encontró
        throw checkError;
      }
      
      // Si ya existe, no hacer nada
      if (existing) {
        return { success: true, error: null };
      }
      
      // Crear nuevo registro de progreso
      const { error } = await supabase
        .from(TABLES.USER_PROGRESS)
        .insert({
          user_id: userId,
          course_id: courseId,
          lesson_id: lessonId,
          completed_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      return { success: true, error: null };
    } catch (error) {
      console.error(`Error al marcar lección ${lessonId} como completada:`, error);
      return { success: false, error };
    }
  },
  
  // Obtener historial de compras de un usuario
  async getUserPurchases(userId) {
    try {
      const { data, error } = await supabase
        .from(TABLES.PURCHASES)
        .select(`
          *,
          course:${TABLES.COURSES}(id, title, thumbnail),
          ebook:ebooks(id, title, thumbnail)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Procesar los datos para un formato uniforme
      const processedPurchases = data.map(purchase => {
        // Determinar el tipo de compra y sus detalles
        let itemDetails = null;
        if (purchase.course_id && purchase.course) {
          itemDetails = purchase.course;
        } else if (purchase.ebook_id && purchase.ebook) {
          itemDetails = purchase.ebook;
        }
        
        return {
          id: purchase.id,
          title: itemDetails ? itemDetails.title : 'Producto',
          amount: purchase.amount,
          date: purchase.created_at,
          status: purchase.status,
          type: purchase.course_id ? 'course' : purchase.ebook_id ? 'ebook' : purchase.token_amount ? 'tokens' : 'other',
          payment_method: purchase.payment_method,
          thumbnail: itemDetails ? itemDetails.thumbnail : null,
          item_id: purchase.course_id || purchase.ebook_id || null,
          details: {
            token_count: purchase.token_amount || null
          }
        };
      });
      
      return { purchases: processedPurchases, error: null };
    } catch (error) {
      console.error(`Error al obtener historial de compras para ${userId}:`, error);
      return { purchases: [], error };
    }
  },
  
  // Agregar un curso al carrito
  async addCourseToCart(courseId, userId) {
    try {
      // Verificar si el usuario ya ha comprado este curso
      const { data: existingPurchase, error: checkError } = await supabase
        .from(TABLES.USER_COURSES)
        .select('*')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }
      
      if (existingPurchase) {
        return { 
          success: false, 
          error: { message: 'Ya has comprado este curso' }, 
          alreadyPurchased: true 
        };
      }
      
      // Obtener detalles del curso para añadir al carrito
      const { data: course, error: courseError } = await dataService.getById(TABLES.COURSES, courseId);
      if (courseError) throw courseError;
      
      return { 
        success: true, 
        error: null, 
        item: {
          id: course.id,
          title: course.title,
          type: 'course',
          price: course.price,
          thumbnail: course.thumbnail
        }
      };
    } catch (error) {
      console.error(`Error al agregar curso ${courseId} al carrito:`, error);
      return { success: false, error, alreadyPurchased: false };
    }
  },
  
  // Procesar la compra de un curso
  async purchaseCourse(courseId, userId, transactionDetails) {
    try {
      // Crear registro de compra
      const { data: purchase, error: purchaseError } = await dataService.create(TABLES.PURCHASES, {
        user_id: userId,
        course_id: courseId,
        amount: transactionDetails.amount,
        payment_method: transactionDetails.method,
        status: 'completed',
        invoice_url: transactionDetails.invoiceUrl || null,
        created_at: new Date().toISOString()
      });
      
      if (purchaseError) throw purchaseError;
      
      // Asignar curso al usuario
      const { error: assignError } = await dataService.create(TABLES.USER_COURSES, {
        user_id: userId,
        course_id: courseId,
        purchased_at: new Date().toISOString(),
        expires_at: null, // Cursos sin expiración
        active: true
      });
      
      if (assignError) throw assignError;
      
      return { success: true, error: null, purchaseId: purchase.id };
    } catch (error) {
      console.error(`Error al procesar compra del curso ${courseId}:`, error);
      return { success: false, error };
    }
  }
};

export default coursesService;
